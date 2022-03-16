from __future__ import unicode_literals
from django.db import models
from django.contrib.gis.db import models as gis_models
from django.db.models import Manager as GeoManager
from ngeo.apps.common.models import CommonCoreModel

# Threat model - stores linestrings
class Threat(CommonCoreModel):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=250, null=True, blank=True)
    date_reported = models.DateTimeField(null=True, blank=True)
    color = models.CharField(max_length=20, null=True, blank=True)
    # from (county)
    origin = models.CharField(max_length=250, null=True, blank=True)
    # to (county)
    destination = models.CharField(max_length=250, null=True, blank=True)
    # Threat type
    threat_type = models.CharField(max_length=100, null=True, blank=True)
    # Enable filtering by region from geoserver
    from_region = models.CharField(max_length=50, null=True, blank=True)
    to_region = models.CharField(max_length=50, null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    delete_reason = models.TextField(max_length=1000, null=True, blank=True)


    # Geo Field
    location = gis_models.LineStringField(srid=4326, null=True)

    objects = GeoManager()

    def delete(self):
        self.deactivate()
        super(Threat, self).delete()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = " Threats"