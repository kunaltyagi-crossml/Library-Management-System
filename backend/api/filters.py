from django_filters import rest_framework as filters
from catalog.models import Book, Category
from transactions.models import Transaction, Reservation
from django.contrib.auth import get_user_model

User = get_user_model()


class BookFilter(filters.FilterSet):
    """Filter for Book model"""
    title = filters.CharFilter(lookup_expr='icontains')
    author = filters.CharFilter(lookup_expr='icontains')
    isbn = filters.CharFilter(lookup_expr='exact')
    category = filters.ModelChoiceFilter(queryset=Category.objects.all())
    status = filters.ChoiceFilter(choices=Book.STATUS_CHOICES)
    language = filters.CharFilter(lookup_expr='icontains')
    publication_year = filters.NumberFilter(field_name='publication_date__year')
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')
    available = filters.BooleanFilter(method='filter_available')
    
    class Meta:
        model = Book
        fields = ['title', 'author', 'isbn', 'category', 'status', 'language']
    
    def filter_available(self, queryset, name, value):
        if value:
            return queryset.filter(status='available', available_copies__gt=0)
        return queryset


class TransactionFilter(filters.FilterSet):
    """Filter for Transaction model"""
    user = filters.ModelChoiceFilter(queryset=User.objects.all())
    book = filters.ModelChoiceFilter(queryset=Book.objects.all())
    status = filters.ChoiceFilter(choices=Transaction.STATUS_CHOICES)
    issue_date = filters.DateFromToRangeFilter()
    due_date = filters.DateFromToRangeFilter()
    return_date = filters.DateFromToRangeFilter()
    overdue = filters.BooleanFilter(method='filter_overdue')
    unpaid_fine = filters.BooleanFilter(method='filter_unpaid_fine')
    
    class Meta:
        model = Transaction
        fields = ['user', 'book', 'status', 'fine_paid']
    
    def filter_overdue(self, queryset, name, value):
        if value:
            from django.utils import timezone
            return queryset.filter(
                return_date__isnull=True,
                due_date__lt=timezone.now().date()
            )
        return queryset
    
    def filter_unpaid_fine(self, queryset, name, value):
        if value:
            return queryset.filter(fine_paid=False, fine_amount__gt=0)
        return queryset


class ReservationFilter(filters.FilterSet):
    """Filter for Reservation model"""
    user = filters.ModelChoiceFilter(queryset=User.objects.all())
    book = filters.ModelChoiceFilter(queryset=Book.objects.all())
    status = filters.ChoiceFilter(choices=Reservation.STATUS_CHOICES)
    reservation_date = filters.DateFromToRangeFilter()
    
    class Meta:
        model = Reservation
        fields = ['user', 'book', 'status', 'notified']


class UserFilter(filters.FilterSet):
    """Filter for User model"""
    user_type = filters.ChoiceFilter(choices=User.USER_TYPE_CHOICES)
    status = filters.ChoiceFilter(choices=User.STATUS_CHOICES)
    username = filters.CharFilter(lookup_expr='icontains')
    email = filters.CharFilter(lookup_expr='icontains')
    first_name = filters.CharFilter(lookup_expr='icontains')
    last_name = filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = User
        fields = ['user_type', 'status', 'username', 'email']