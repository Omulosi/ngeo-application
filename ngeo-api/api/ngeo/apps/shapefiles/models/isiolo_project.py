# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class IsioloProject(models.Model):
    objectid = models.IntegerField()
    fname = models.CharField(max_length=254)
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude = models.FloatField()
    couname = models.CharField(max_length=254)
    scouname = models.CharField(max_length=254)
    divname = models.CharField(max_length=254)
    locname = models.CharField(max_length=254)
    slname = models.CharField(max_length=254)
    constname = models.CharField(max_length=254)
    wardname = models.CharField(max_length=254)
    villname = models.CharField(max_length=254)
    foo = models.CharField(max_length=50, blank=True, null=True)
    theme = models.CharField(max_length=50)
    control = models.CharField(max_length=50)
    geom = models.MultiPointField(srid=4326)

    class Meta:
        verbose_name_plural = "Isiolo projects"
