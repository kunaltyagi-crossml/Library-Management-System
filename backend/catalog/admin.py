from django.contrib import admin
from .models import Category, Book


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'books_count', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'isbn', 'category', 'status', 'available_copies', 'total_copies', 'added_date')
    list_filter = ('status', 'condition', 'category', 'language', 'format')
    search_fields = ('title', 'author', 'isbn', 'isbn_10', 'call_number', 'keywords')
    ordering = ('-created_at',)
    readonly_fields = ('added_date', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'subtitle', 'isbn', 'isbn_10')
        }),
        ('Author & Publisher', {
            'fields': ('author', 'co_authors', 'publisher', 'publication_date', 'edition')
        }),
        ('Classification', {
            'fields': ('category', 'language', 'keywords')
        }),
        ('Physical Details', {
            'fields': ('pages', 'format', 'cover_image', 'description')
        }),
        ('Library Management', {
            'fields': ('status', 'condition', 'location', 'call_number')
        }),
        ('Inventory', {
            'fields': ('total_copies', 'available_copies', 'price')
        }),
        ('Timestamps', {
            'fields': ('added_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )