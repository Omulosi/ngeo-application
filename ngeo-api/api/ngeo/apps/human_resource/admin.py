from django.contrib import admin
from .models import HumanResource


@admin.register(HumanResource)
class HumanResourceAdmin(admin.ModelAdmin):
    pass


