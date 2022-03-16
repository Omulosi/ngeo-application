from django.contrib import admin
from .models import RegionalManager

@admin.register(RegionalManager)
class RegionalManagerAdmin(admin.ModelAdmin):
    pass


