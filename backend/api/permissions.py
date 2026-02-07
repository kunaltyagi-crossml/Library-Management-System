from rest_framework import permissions


class IsStaffOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff members to edit objects.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Write permissions are only allowed to staff members
        return request.user and request.user.is_staff


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or staff to view/edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Staff members have full access
        if request.user.is_staff:
            return True
        
        # Check if the object has a 'user' attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # For User objects
        return obj == request.user


class IsStaffUser(permissions.BasePermission):
    """
    Custom permission to only allow staff members.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff