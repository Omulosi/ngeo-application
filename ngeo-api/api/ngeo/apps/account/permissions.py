from rest_framework.permissions import BasePermission

class IsNotAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_authenticated

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return not request.user.role == 1

class IsCEO(BasePermission):
    def has_permission(self, request, view):
        return not request.user.role == 2

class IsAudit(BasePermission):
    def has_permission(self, request, view):
        return not request.user.role == 3

class IsFinance(BasePermission):
    def has_permission(self, request, view):
        return not request.user.role == 4

class IsRegionalManager(BasePermission):
    def has_permission(self, request, view):
        return not request.user.role == 5

class IsCountyManager(BasePermission):
    def has_permission(self, request, view):
        return not request.user.role == 6

class IsFieldOfficer(BasePermission):
    def has_permission(self, request, view):
        return not request.user.role == 7

class IsNormalUser(BasePermission):
    def has_permission(self, request, view):
        return not request.user.role == 8

class IsHR(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 9