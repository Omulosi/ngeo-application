from django.contrib import admin
from .models import FieldOfficer
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.field_officer.models import FieldOfficer

@admin.register(FieldOfficer)
class FieldOfficerAdmin(admin.ModelAdmin):
    pass
    
