from django.contrib import admin
from .models import Transaction, Reservation


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'issue_date', 'due_date', 'return_date', 'status', 'fine_amount', 'fine_paid')
    list_filter = ('status', 'fine_paid', 'issue_date', 'due_date')
    search_fields = ('user__username', 'user__email', 'book__title', 'book__isbn')
    ordering = ('-issue_date',)
    readonly_fields = ('issue_date', 'created_at', 'updated_at', 'is_overdue', 'days_overdue')
    
    fieldsets = (
        ('Transaction Details', {
            'fields': ('user', 'book', 'status')
        }),
        ('Dates', {
            'fields': ('issue_date', 'due_date', 'return_date', 'is_overdue', 'days_overdue')
        }),
        ('Fine Details', {
            'fields': ('fine_amount', 'fine_paid')
        }),
        ('Staff Information', {
            'fields': ('issued_by', 'returned_to', 'remarks')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_returned']
    
    def mark_as_returned(self, request, queryset):
        """Admin action to mark transactions as returned"""
        count = 0
        for transaction in queryset.filter(return_date__isnull=True):
            transaction.mark_as_returned(returned_to=request.user)
            count += 1
        self.message_user(request, f"{count} transaction(s) marked as returned.")
    mark_as_returned.short_description = "Mark selected as returned"


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'reservation_date', 'expiry_date', 'status', 'notified')
    list_filter = ('status', 'notified', 'reservation_date')
    search_fields = ('user__username', 'user__email', 'book__title', 'book__isbn')
    ordering = ('-reservation_date',)
    readonly_fields = ('reservation_date', 'created_at', 'updated_at', 'is_expired')
    
    actions = ['cancel_reservations']
    
    def cancel_reservations(self, request, queryset):
        """Admin action to cancel reservations"""
        count = queryset.filter(status='active').update(status='cancelled')
        self.message_user(request, f"{count} reservation(s) cancelled.")
    cancel_reservations.short_description = "Cancel selected reservations"