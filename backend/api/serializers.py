from rest_framework import serializers
from django.contrib.auth import get_user_model
from catalog.models import Category, Book
from transactions.models import Transaction, Reservation
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    books_issued_count = serializers.ReadOnlyField()
    can_issue_books = serializers.ReadOnlyField()
    is_membership_active = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'status', 'phone_number', 'address', 'date_of_birth',
            'profile_picture', 'library_card_number', 'max_books_allowed',
            'membership_start_date', 'membership_end_date', 'books_issued_count',
            'can_issue_books', 'is_membership_active', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'membership_start_date']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2', 'first_name', 
            'last_name', 'user_type', 'phone_number', 'address', 'date_of_birth'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    books_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'books_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BookSerializer(serializers.ModelSerializer):
    """Serializer for Book model"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_available = serializers.ReadOnlyField()
    issued_copies = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'subtitle', 'isbn', 'isbn_10', 'author', 'co_authors',
            'publisher', 'publication_date', 'edition', 'category', 'category_name',
            'language', 'pages', 'format', 'status', 'condition', 'location',
            'call_number', 'total_copies', 'available_copies', 'issued_copies',
            'price', 'description', 'cover_image', 'keywords', 'added_date',
            'is_available', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'added_date', 'created_at', 'updated_at']


class BookListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for book list"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'isbn', 'category_name', 'status',
            'available_copies', 'total_copies', 'is_available', 'cover_image'
        ]


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_isbn = serializers.CharField(source='book.isbn', read_only=True)
    issued_by_name = serializers.CharField(source='issued_by.get_full_name', read_only=True)
    returned_to_name = serializers.CharField(source='returned_to.get_full_name', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    days_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'user_name', 'book', 'book_title', 'book_isbn',
            'issue_date', 'due_date', 'return_date', 'status', 'fine_amount',
            'fine_paid', 'issued_by', 'issued_by_name', 'returned_to',
            'returned_to_name', 'remarks', 'is_overdue', 'days_overdue',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'issue_date', 'created_at', 'updated_at']


class TransactionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating transactions (issuing books)"""
    
    class Meta:
        model = Transaction
        fields = ['user', 'book', 'due_date', 'issued_by', 'remarks']
    
    def validate(self, attrs):
        user = attrs.get('user')
        book = attrs.get('book')
        
        # Check if user can issue books
        if not user.can_issue_books:
            raise serializers.ValidationError(
                f"User has reached maximum book limit of {user.max_books_allowed}"
            )
        
        # Check if book is available
        if not book.is_available:
            raise serializers.ValidationError("Book is not available for issue")
        
        # Check if user's membership is active
        if not user.is_membership_active:
            raise serializers.ValidationError("User's membership has expired")
        
        # Set default due date if not provided (14 days from now)
        if 'due_date' not in attrs:
            attrs['due_date'] = (timezone.now() + timedelta(days=14)).date()
        
        return attrs


class TransactionReturnSerializer(serializers.Serializer):
    """Serializer for returning books"""
    transaction_id = serializers.IntegerField()
    returned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_staff=True),
        required=False
    )
    remarks = serializers.CharField(required=False, allow_blank=True)
    
    def validate_transaction_id(self, value):
        try:
            transaction = Transaction.objects.get(id=value)
            if transaction.return_date:
                raise serializers.ValidationError("Book already returned")
            return value
        except Transaction.DoesNotExist:
            raise serializers.ValidationError("Transaction not found")


class ReservationSerializer(serializers.ModelSerializer):
    """Serializer for Reservation model"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_isbn = serializers.CharField(source='book.isbn', read_only=True)
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = Reservation
        fields = [
            'id', 'user', 'user_name', 'book', 'book_title', 'book_isbn',
            'reservation_date', 'expiry_date', 'status', 'notified',
            'remarks', 'is_expired', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reservation_date', 'created_at', 'updated_at']
    
    def validate(self, attrs):
        # Set default expiry date if not provided (7 days from now)
        if 'expiry_date' not in attrs:
            attrs['expiry_date'] = timezone.now() + timedelta(days=7)
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile with statistics"""
    
    # Fields pulled from the related Profile model
    user_type = serializers.ReadOnlyField(source='profile.role')
    phone_number = serializers.ReadOnlyField(source='profile.phone_number')
    max_books_allowed = serializers.ReadOnlyField(source='profile.max_books')
    
    # Statistical Fields
    total_books_issued = serializers.SerializerMethodField()
    total_books_returned = serializers.SerializerMethodField()
    current_fine = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'phone_number', 'max_books_allowed',
            'total_books_issued', 'total_books_returned', 'current_fine'
        ]
    
    def get_total_books_issued(self, obj):
        # Assumes the Transaction model has a related_name='transactions'
        return obj.transaction_set.count() 
    
    def get_total_books_returned(self, obj):
        return obj.transaction_set.filter(status='returned').count()
    
    def get_current_fine(self, obj):
        # Accessing the transaction through the User object
        unpaid_fines = obj.transaction_set.filter(fine_paid=False).aggregate(
            total=Sum('fine_amount')
        )
        return unpaid_fines['total'] or 0.00