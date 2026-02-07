from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from catalog.models import Book


class Transaction(models.Model):
    """
    Book Transaction model for issue and return operations
    """
    STATUS_CHOICES = (
        ('issued', 'Issued'),
        ('returned', 'Returned'),
        ('overdue', 'Overdue'),
        ('lost', 'Lost'),
    )
    
    # Relationships
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='transactions')
    
    # Transaction Details
    issue_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateTimeField(blank=True, null=True)
    
    # Status and Fees
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='issued')
    fine_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    fine_paid = models.BooleanField(default=False)
    
    # Additional Information
    issued_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='issued_transactions',
        help_text="Staff member who issued the book"
    )
    returned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='received_transactions',
        help_text="Staff member who received the returned book"
    )
    remarks = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-issue_date']
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['book', 'status']),
            models.Index(fields=['due_date']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.status})"
    
    def clean(self):
        """Validate transaction before saving"""
        # Check if user can issue books
        if not self.pk:  # Only for new transactions
            if not self.user.can_issue_books:
                raise ValidationError(f"User has reached maximum book limit of {self.user.max_books_allowed}")
            
            # Check if book is available
            if not self.book.is_available:
                raise ValidationError("Book is not available for issue")
            
            # Check if user's membership is active
            if not self.user.is_membership_active:
                raise ValidationError("User's membership has expired")
    
    @property
    def is_overdue(self):
        """Check if transaction is overdue"""
        if self.return_date:
            return False
        return timezone.now().date() > self.due_date
    
    @property
    def days_overdue(self):
        """Calculate days overdue"""
        if not self.is_overdue:
            return 0
        return (timezone.now().date() - self.due_date).days
    
    def calculate_fine(self, fine_per_day=5.00):
        """Calculate fine for overdue books"""
        if self.is_overdue:
            return self.days_overdue * fine_per_day
        return 0.00
    
    def mark_as_returned(self, returned_to=None):
        """Mark transaction as returned"""
        self.return_date = timezone.now()
        self.status = 'returned'
        self.returned_to = returned_to
        
        # Calculate fine if overdue
        if self.is_overdue:
            self.fine_amount = self.calculate_fine()
        
        # Update book availability
        self.book.available_copies += 1
        if self.book.available_copies > 0:
            self.book.status = 'available'
        self.book.save()
        
        self.save()
    
    def save(self, *args, **kwargs):
        """Override save to update book status"""
        is_new = self.pk is None
        
        if is_new:
            # For new transactions, reduce available copies
            if self.book.available_copies > 0:
                self.book.available_copies -= 1
                if self.book.available_copies == 0:
                    self.book.status = 'issued'
                self.book.save()
        
        # Update status based on dates
        if not self.return_date and self.is_overdue:
            self.status = 'overdue'
            self.fine_amount = self.calculate_fine()
        
        super().save(*args, **kwargs)


class Reservation(models.Model):
    """
    Book Reservation model for users to reserve books
    """
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reservations')
    reservation_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notified = models.BooleanField(default=False)
    remarks = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-reservation_date']
        verbose_name = 'Reservation'
        verbose_name_plural = 'Reservations'
        unique_together = ['user', 'book', 'status']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.status})"
    
    @property
    def is_expired(self):
        """Check if reservation has expired"""
        return timezone.now() > self.expiry_date and self.status == 'active'
    
    def cancel(self):
        """Cancel the reservation"""
        self.status = 'cancelled'
        self.save()