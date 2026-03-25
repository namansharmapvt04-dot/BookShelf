from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Profile, UserBook, ReadingSession, Review


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True, label='Confirm password')

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Password fields did not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'bio', 'avatar_url', 'reading_goal')


class UserBookSerializer(serializers.ModelSerializer):
    total_pages_read = serializers.ReadOnlyField()
    progress_percent = serializers.ReadOnlyField()

    class Meta:
        model = UserBook
        fields = (
            'id', 'google_book_id', 'title', 'authors', 'thumbnail',
            'status', 'page_count', 'categories', 'added_at',
            'total_pages_read', 'progress_percent',
        )
        read_only_fields = ('id', 'added_at', 'total_pages_read', 'progress_percent')


class ReadingSessionSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='user_book.title', read_only=True)

    class Meta:
        model = ReadingSession
        fields = ('id', 'user_book', 'book_title', 'pages_read', 'date', 'notes', 'created_at')
        read_only_fields = ('id', 'created_at', 'book_title')


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = (
            'id', 'google_book_id', 'book_title', 'rating', 'review_text',
            'username', 'created_at'
        )
        read_only_fields = ('id', 'username', 'created_at')
