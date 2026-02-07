from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class User(AbstractUser):
    """
    Custom User model for Library Management System
    """
    USER_TYPE_CHOICES = (
        ('staff', 'Staff'),
        ('student', 'Student'),
        ('external', 'External Member'),
        ('faculty', 'Faculty'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='student')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")],
        blank=True,
        null=True
    )
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    library_card_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    max_books_allowed = models.IntegerField(default=5)
    membership_start_date = models.DateField(auto_now_add=True)
    membership_end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"
    
    @property
    def is_membership_active(self):
        """Check if user's membership is active"""
        if self.membership_end_date:
            from django.utils import timezone
            return self.membership_end_date >= timezone.now().date()
        return True
    
    @property
    def books_issued_count(self):
        """Count of currently issued books"""
        return self.transactions.filter(return_date__isnull=True).count()
    
    @property
    def can_issue_books(self):
        """Check if user can issue more books"""
        return self.books_issued_count < self.max_books_allowed