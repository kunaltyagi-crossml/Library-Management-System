from django.db import models
from django.core.validators import MinValueValidator


class Category(models.Model):
    """
    Book Category/Genre model
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name
    
    @property
    def books_count(self):
        """Count of books in this category"""
        return self.books.count()


class Book(models.Model):
    """
    Book model for catalog
    """
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('issued', 'Issued'),
        ('reserved', 'Reserved'),
        ('maintenance', 'Under Maintenance'),
        ('lost', 'Lost'),
    )
    
    CONDITION_CHOICES = (
        ('new', 'New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    )
    
    # Basic Information
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    isbn = models.CharField(max_length=13, unique=True, help_text="13 Character ISBN number")
    isbn_10 = models.CharField(max_length=10, blank=True, null=True, help_text="10 Character ISBN number")
    
    # Author and Publisher Information
    author = models.CharField(max_length=255)
    co_authors = models.TextField(blank=True, null=True, help_text="Comma-separated list of co-authors")
    publisher = models.CharField(max_length=255)
    publication_date = models.DateField(blank=True, null=True)
    edition = models.CharField(max_length=50, blank=True, null=True)
    
    # Classification
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    language = models.CharField(max_length=50, default='English')
    
    # Physical Details
    pages = models.IntegerField(validators=[MinValueValidator(1)], blank=True, null=True)
    format = models.CharField(max_length=50, default='Paperback', 
                             help_text="e.g., Hardcover, Paperback, eBook")
    
    # Library Management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    location = models.CharField(max_length=100, help_text="Shelf/Rack location in library")
    call_number = models.CharField(max_length=50, unique=True, help_text="Library classification number")
    
    # Inventory
    total_copies = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    available_copies = models.IntegerField(default=1, validators=[MinValueValidator(0)])
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Additional Information
    description = models.TextField(blank=True, null=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    keywords = models.TextField(blank=True, null=True, help_text="Comma-separated keywords for search")
    
    # Timestamps
    added_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Book'
        verbose_name_plural = 'Books'
        indexes = [
            models.Index(fields=['isbn']),
            models.Index(fields=['title']),
            models.Index(fields=['author']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.title} by {self.author}"
    
    @property
    def is_available(self):
        """Check if book is available for issue"""
        return self.status == 'available' and self.available_copies > 0
    
    @property
    def issued_copies(self):
        """Calculate number of issued copies"""
        return self.total_copies - self.available_copies
    
    def save(self, *args, **kwargs):
        """Override save to ensure available_copies doesn't exceed total_copies"""
        if self.available_copies > self.total_copies:
            self.available_copies = self.total_copies
        super().save(*args, **kwargs)