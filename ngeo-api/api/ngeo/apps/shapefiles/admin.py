"""Shapefiles admin."""

from django.contrib.gis import admin
# from ngeo.apps.shapefiles import models
# from ngeo.apps.shapefiles.models import County, SubLocation, IsioloProject, IsioloKeyInstallation
# from leaflet.admin import LeafletGeoAdmin

# @admin.register(County)
# class CountyAdmin(admin.OSMGeoAdmin):
#     list_display = ('counties', 'cty_code')
#     search_fields = ('counties', )
#     filter_fields = ('counties', 'cty_code')


# @admin.register(SubLocation)
# class SubLocationAdmin(admin.OSMGeoAdmin):
#     list_display = ('sub_name', 'locname', 'divname', 'distname', 'provname')
#     search_fields = ('locname', 'divname')
#     filter_fields = ('code_sub', 'sub_name')


# @admin.register(IsioloProject)
# class IsioloProjectAdmin(admin.OSMGeoAdmin):
#     list_display = ('fname', 'theme', 'couname', 'scouname','divname', 'villname', 'wardname', 'latitude', 'longitude', 'altitude', 'foo', 'geom')
#     search_fields = ('fname', 'theme', 'villname', 'wardname')
#     filter_fields = ('fname', 'theme', 'villname', 'wardname')

# @admin.register(IsioloKeyInstallation)
# class IsioloKeyInstallationAdmin(admin.OSMGeoAdmin):
#     list_display = ('inst_name', 'type', 'sub_type')
#     search_fields = ('inst_name', 'type', 'sub_type')
#     filter_fields = ('inst_name', 'type', 'sub_type')

# @admin.register(County)
# class CountyAdmin(LeafletGeoAdmin):
#     list_display = ('counties', 'cty_code')
#     search_fields = ('counties', )
#     filter_fields = ('counties', 'cty_code')


# @admin.register(SubLocation)
# class SubLocationAdmin(LeafletGeoAdmin):
#     list_display = ('sub_name', 'locname', 'divname', 'distname', 'provname')
#     search_fields = ('locname', 'divname')
#     filter_fields = ('code_sub', 'sub_name')

# @admin.register(models.Region)
# class RegionAdmin(admin.OSMGeoAdmin):
#     # list_display = ('counties', 'cty_code')
#     # search_fields = ('counties', )
#     # filter_fields = ('counties', 'cty_code')
#     pass

# @admin.register(models.OutreachOfficer)
# class OfficeAdmin(admin.OSMGeoAdmin):
#     # list_display = ('counties', 'cty_code')
#     # search_fields = ('counties', )
#     # filter_fields = ('counties', 'cty_code')
#     pass

# @admin.register(models.CountyGazetted)
# class CountyGazettedAdmin(admin.OSMGeoAdmin):
#     list_display = ('counties', )
#     search_fields = ('counties', )
#     filter_fields = ('counties',)
    

# @admin.register(models.Constituency)
# class ConstituencyAdmin(admin.OSMGeoAdmin):
#     # list_display = ('counties', 'cty_code')
#     # search_fields = ('counties', )
#     # filter_fields = ('counties', 'cty_code')
#     pass