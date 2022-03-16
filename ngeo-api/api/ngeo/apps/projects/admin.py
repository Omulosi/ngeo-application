from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import Project

@admin.register(Project)
class ProjectAdmin(OSMGeoAdmin):
    search_fields = ('name', 'region', 'county')
