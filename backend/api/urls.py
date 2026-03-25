from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, ProfileView,
    book_search,
    ShelfListCreateView, ShelfDetailView,
    ReadingSessionView,
    ReviewListCreateView, MyReviewsView,
    discover, dashboard,
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),

    # Books / Search
    path('books/search/', book_search, name='book_search'),

    # Shelf
    path('shelf/', ShelfListCreateView.as_view(), name='shelf-list'),
    path('shelf/<int:pk>/', ShelfDetailView.as_view(), name='shelf-detail'),

    # Reading Tracker
    path('tracker/', ReadingSessionView.as_view(), name='tracker'),

    # Reviews
    path('reviews/', ReviewListCreateView.as_view(), name='reviews'),
    path('reviews/my/', MyReviewsView.as_view(), name='my-reviews'),

    # Discovery & Dashboard
    path('discover/', discover, name='discover'),
    path('dashboard/', dashboard, name='dashboard'),
]
