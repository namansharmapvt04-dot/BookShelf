from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    avatar_url = models.URLField(blank=True, default='')
    reading_goal = models.PositiveIntegerField(default=12)  # books per year

    def __str__(self):
        return f"Profile of {self.user.username}"


class UserBook(models.Model):
    STATUS_CHOICES = [
        ('want_to_read', 'Want to Read'),
        ('reading', 'Reading'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shelf')
    google_book_id = models.CharField(max_length=50)
    title = models.CharField(max_length=500)
    authors = models.CharField(max_length=500, blank=True, default='')
    thumbnail = models.URLField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='want_to_read')
    page_count = models.PositiveIntegerField(default=0)
    categories = models.CharField(max_length=500, blank=True, default='')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'google_book_id')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.title} ({self.status}) - {self.user.username}"

    @property
    def total_pages_read(self):
        return self.sessions.aggregate(
            total=models.Sum('pages_read')
        )['total'] or 0

    @property
    def progress_percent(self):
        if self.page_count and self.page_count > 0:
            return min(round((self.total_pages_read / self.page_count) * 100, 1), 100)
        return 0


class ReadingSession(models.Model):
    user_book = models.ForeignKey(UserBook, on_delete=models.CASCADE, related_name='sessions')
    pages_read = models.PositiveIntegerField(default=0)
    date = models.DateField()
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.user_book.title} - {self.pages_read} pages on {self.date}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    google_book_id = models.CharField(max_length=50)
    book_title = models.CharField(max_length=500, blank=True, default='')
    rating = models.PositiveSmallIntegerField(
        choices=[(i, i) for i in range(1, 6)]
    )
    review_text = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'google_book_id')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} for {self.google_book_id} - {self.rating}/5"
