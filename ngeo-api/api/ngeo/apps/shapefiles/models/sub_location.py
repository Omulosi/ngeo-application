# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class SubLocation(models.Model):
    objectid = models.BigIntegerField()
    locname = models.CharField(max_length=20, blank=True, null=True)
    divname = models.CharField(max_length=20, blank=True, null=True)
    distname = models.CharField(max_length=20, blank=True, null=True)
    provname = models.CharField(max_length=20, blank=True, null=True)
    code_sub = models.FloatField(blank=True, null=True)
    sub_name = models.CharField(max_length=19, blank=True, null=True)
    shape_leng = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    geom = models.MultiPolygonField(srid=4326)


    class Meta:
        verbose_name_plural = "Sub-locations"
