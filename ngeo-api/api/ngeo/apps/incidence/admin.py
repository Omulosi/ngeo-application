from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import Incident


# class IncidentAdmin(OSMGeoAdmin):
#     list_display = ("name", "date_reported", "location")
#     search_fields = ("name",)
#     filter_fields = ("name", "date_reported")


# admin.site.register(Incident, IncidentAdmin)
