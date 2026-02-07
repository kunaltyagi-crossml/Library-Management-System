from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'status', 'library_card_number', 'is_staff')
    list_filter = ('user_type', 'status', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'library_card_number')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Library Information', {
            'fields': ('user_type', 'status', 'library_card_number', 'max_books_allowed', 
                      'membership_start_date', 'membership_end_date')
        }),
        ('Personal Information', {
            'fields': ('phone_number', 'address', 'date_of_birth', 'profile_picture')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Library Information', {
            'fields': ('user_type', 'status', 'library_card_number', 'max_books_allowed')
        }),
    )