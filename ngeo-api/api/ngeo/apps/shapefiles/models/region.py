# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class Region(models.Model):
    country = models.CharField(max_length=16)
    region = models.CharField(max_length=50)
    geom = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return self.region
