from django.contrib.gis.db import models


class KenyaHealth(models.Model):
    fno = models.IntegerField(blank=True, null=True)
    f_name = models.CharField(max_length=32, blank=True, null=True)
    hmis_field = models.IntegerField(blank=True, null=True)
    prov = models.CharField(max_length=12, blank=True, null=True)
    dist = models.CharField(max_length=16, blank=True, null=True)
    division = models.CharField(max_length=23, blank=True, null=True)
    location = models.CharField(max_length=24, blank=True, null=True)
    sub_locati = models.CharField(max_length=26, blank=True, null=True)
    long = models.FloatField(blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    spatial_re = models.CharField(max_length=35, blank=True, null=True)
    f_type = models.IntegerField(blank=True, null=True)
    agency = models.CharField(max_length=8, blank=True, null=True)
    geom = models.MultiPointField(srid=4326)

# GDALException: Invalid pointer returned from "OGROpen"