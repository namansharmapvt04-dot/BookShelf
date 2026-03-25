from django.contrib import admin
from .models import User, Profile, UserBook, ReadingSession, Review


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'date_joined', 'is_active')
    search_fields = ('username', 'email')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'reading_goal')


@admin.register(UserBook)
class UserBookAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'added_at')
    list_filter = ('status',)
    search_fields = ('title', 'authors', 'google_book_id')


@admin.register(ReadingSession)
class ReadingSessionAdmin(admin.ModelAdmin):
    list_display = ('user_book', 'pages_read', 'date')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'google_book_id', 'rating', 'created_at')
    list_filter = ('rating',)
