from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q, Sum
from django_filters.rest_framework import DjangoFilterBackend

from catalog.models import Category, Book
from transactions.models import Transaction, Reservation
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserProfileSerializer,
    CategorySerializer, BookSerializer, BookListSerializer,
    TransactionSerializer, TransactionCreateSerializer, TransactionReturnSerializer,
    ReservationSerializer
)
from .filters import BookFilter, TransactionFilter, ReservationFilter, UserFilter
from .permissions import IsStaffOrReadOnly, IsOwnerOrStaff, IsStaffUser

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model
    Provides CRUD operations for users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = UserFilter
    search_fields = ['username', 'email', 'first_name', 'last_name', 'library_card_number']
    ordering_fields = ['username', 'date_joined', 'user_type']
    ordering = ['-date_joined']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        if self.action == 'profile':
            return UserProfileSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user profile"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def transactions(self, request, pk=None):
        """Get all transactions for a user"""
        user = self.get_object()
        transactions = Transaction.objects.filter(user=user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def reservations(self, request, pk=None):
        """Get all reservations for a user"""
        user = self.get_object()
        reservations = Reservation.objects.filter(user=user)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category model
    Provides CRUD operations for categories
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsStaffOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    @action(detail=True, methods=['get'])
    def books(self, request, pk=None):
        """Get all books in a category"""
        category = self.get_object()
        books = Book.objects.filter(category=category)
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)


class BookViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Book model
    Provides CRUD operations for books with filtering and search
    """
    queryset = Book.objects.select_related('category').all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated, IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = BookFilter
    search_fields = ['title', 'author', 'isbn', 'keywords', 'description']
    ordering_fields = ['title', 'author', 'publication_date', 'added_date']
    ordering = ['-added_date']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        return BookSerializer
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available books"""
        books = self.queryset.filter(status='available', available_copies__gt=0)
        page = self.paginate_queryset(books)
        if page is not None:
            serializer = BookListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        """Get all transactions for a book"""
        book = self.get_object()
        transactions = Transaction.objects.filter(book=book)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get book statistics"""
        total_books = Book.objects.count()
        available_books = Book.objects.filter(status='available', available_copies__gt=0).count()
        issued_books = Transaction.objects.filter(return_date__isnull=True).count()
        
        return Response({
            'total_books': total_books,
            'available_books': available_books,
            'issued_books': issued_books,
            'total_copies': Book.objects.aggregate(total=Sum('total_copies'))['total'] or 0,
            'available_copies': Book.objects.aggregate(total=Sum('available_copies'))['total'] or 0,
        })


class TransactionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Transaction model
    Handles book issue and return operations
    """
    queryset = Transaction.objects.select_related('user', 'book', 'issued_by', 'returned_to').all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TransactionFilter
    search_fields = ['user__username', 'book__title', 'book__isbn']
    ordering_fields = ['issue_date', 'due_date', 'return_date']
    ordering = ['-issue_date']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        if self.action == 'return_book':
            return TransactionReturnSerializer
        return TransactionSerializer
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.is_staff:
            return self.queryset
        # Non-staff users can only see their own transactions
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Set issued_by to current user when creating transaction"""
        serializer.save(issued_by=self.request.user)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsStaffUser])
    def issue_book(self, request):
        """Issue a book to a user"""
        serializer = TransactionCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(issued_by=request.user)
            return Response(
                TransactionSerializer(serializer.instance).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsStaffUser])
    def return_book(self, request):
        """Return a book"""
        serializer = TransactionReturnSerializer(data=request.data)
        if serializer.is_valid():
            transaction = Transaction.objects.get(id=serializer.validated_data['transaction_id'])
            returned_to = serializer.validated_data.get('returned_to', request.user)
            remarks = serializer.validated_data.get('remarks', '')
            
            if remarks:
                transaction.remarks = remarks
            
            transaction.mark_as_returned(returned_to=returned_to)
            
            return Response(
                TransactionSerializer(transaction).data,
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get all overdue transactions"""
        from django.utils import timezone
        overdue_transactions = self.queryset.filter(
            return_date__isnull=True,
            due_date__lt=timezone.now().date()
        )
        page = self.paginate_queryset(overdue_transactions)
        if page is not None:
            serializer = TransactionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = TransactionSerializer(overdue_transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active (not returned) transactions"""
        active_transactions = self.queryset.filter(return_date__isnull=True)
        page = self.paginate_queryset(active_transactions)
        if page is not None:
            serializer = TransactionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = TransactionSerializer(active_transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsStaffUser])
    def statistics(self, request):
        """Get transaction statistics"""
        from django.utils import timezone
        
        total_transactions = Transaction.objects.count()
        active_transactions = Transaction.objects.filter(return_date__isnull=True).count()
        overdue_transactions = Transaction.objects.filter(
            return_date__isnull=True,
            due_date__lt=timezone.now().date()
        ).count()
        total_fines = Transaction.objects.filter(fine_paid=False).aggregate(
            total=Sum('fine_amount')
        )['total'] or 0
        
        return Response({
            'total_transactions': total_transactions,
            'active_transactions': active_transactions,
            'overdue_transactions': overdue_transactions,
            'total_unpaid_fines': float(total_fines),
        })


class ReservationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Reservation model
    Handles book reservations
    """
    queryset = Reservation.objects.select_related('user', 'book').all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ReservationFilter
    search_fields = ['user__username', 'book__title', 'book__isbn']
    ordering_fields = ['reservation_date', 'expiry_date']
    ordering = ['-reservation_date']
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.is_staff:
            return self.queryset
        # Non-staff users can only see their own reservations
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Set user to current user when creating reservation"""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a reservation"""
        reservation = self.get_object()
        if reservation.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You can only cancel your own reservations'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        reservation.cancel()
        return Response(
            ReservationSerializer(reservation).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active reservations"""
        active_reservations = self.queryset.filter(status='active')
        page = self.paginate_queryset(active_reservations)
        if page is not None:
            serializer = ReservationSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ReservationSerializer(active_reservations, many=True)
        return Response(serializer.data)