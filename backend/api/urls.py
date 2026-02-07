from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import (
    UserViewSet,
    CategoryViewSet,
    BookViewSet,
    TransactionViewSet,
    ReservationViewSet,
)

# DRF Router
router = DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('categories', CategoryViewSet, basename='category')
router.register('books', BookViewSet, basename='book')
router.register('transactions', TransactionViewSet, basename='transaction')
router.register('reservations', ReservationViewSet, basename='reservation')

urlpatterns = [
    # JWT Authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # API endpoints
    path('', include(router.urls)),
]
