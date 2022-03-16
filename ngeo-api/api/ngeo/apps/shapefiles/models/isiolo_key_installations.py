# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class IsioloKeyInstallation(models.Model):
    id = models.IntegerField(primary_key=True)
    inst_name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    sub_type = models.CharField(max_length=50)
    longitude = models.CharField(max_length=50)
    latitude = models.CharField(max_length=50)
    geom = models.MultiPointField(srid=4326)

    class Meta:
        verbose_name_plural = "Isiolo Key Installations"