from django.contrib import admin
from .models import FinanceOfficer


@admin.register(FinanceOfficer)
class FinanceOfficerAdmin(admin.ModelAdmin):
    pass

