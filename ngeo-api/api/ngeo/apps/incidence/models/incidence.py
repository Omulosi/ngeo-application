from __future__ import unicode_literals
from django.db import models
from django.contrib.gis.db import models as gis_models
from django.db.models import Manager as GeoManager
from ngeo.apps.common.models import CoreModel


# Create your models here.
class Incident(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField(max_length=250, null=True, blank=True)
    date_reported = models.DateTimeField(null=True, blank=True)
    location = gis_models.PointField(srid=4326, null=True, blank=True)
    longitude = models.CharField(max_length=50, null=True, blank=True)
    latitude = models.CharField(max_length=50, null=True, blank=True)

    objects = GeoManager()

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = " Incidents"
