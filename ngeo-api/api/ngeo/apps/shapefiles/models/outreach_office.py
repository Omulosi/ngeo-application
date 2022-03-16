# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class OutreachOfficer(models.Model):
    tname = models.CharField(max_length=30)
    status = models.CharField(max_length=20)
    geom = models.MultiPointField(srid=4326)

