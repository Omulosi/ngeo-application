from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import Threat


class ThreatAdmin(OSMGeoAdmin):
    list_display = ("name", "date_reported", "location", "origin", "destination")
    search_fields = ("name",)
    filter_fields = ("name", "date_reported", "location")


admin.site.register(Threat, ThreatAdmin)
