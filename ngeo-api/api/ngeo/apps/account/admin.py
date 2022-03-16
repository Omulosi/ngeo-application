from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

from . import models
from . import forms
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.regional_manager.models import RegionalManager
from ngeo.apps.finance.models import FinanceOfficer
from ngeo.apps.human_resource.models import HumanResource
from ngeo.apps.ceo.models import CEOModel


class FieldOfficerInline(admin.StackedInline):
    model = FieldOfficer
    can_delete = False
    verbose_name_plural = 'field officers'

class CountyManagerInline(admin.StackedInline):
    model = CountyManager
    can_delete = False
    verbose_name_plural = 'county managers'

class RegionalManagerInline(admin.StackedInline):
    model = RegionalManager
    can_delete = False
    verbose_name_plural = 'regional managers'


class FinanceOfficerInline(admin.StackedInline):
    model = FinanceOfficer
    can_delete = False
    verbose_name_plural = 'finance officers'

class HumanResourceInline(admin.StackedInline):
    model = HumanResource
    can_delete = False
    verbose_name_plural = 'human resource officers'

class CEOInline(admin.StackedInline):
    model = CEOModel
    can_delete = False
    verbose_name_plural = 'chief executive officers'


# @admin.register(models.User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = (
        (None, {"fields": ("password",)}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email", "staff_number", "role")}),
        (_("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = ((None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),)
    list_display = ("email", "staff_number", "first_name", "last_name", "role", "is_active", "deleted")
    search_fields = ("first_name", "last_name", "email", "role")
    ordering = ("email",)
    inlines = (FieldOfficerInline, CountyManagerInline, RegionalManagerInline, FinanceOfficerInline, HumanResourceInline, CEOInline)

    form = forms.AdminUserChangeForm


# admin.site.unregister(models.User)
admin.site.register(models.User, UserAdmin)
