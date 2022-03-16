from django.db import models
from django.contrib.gis.db import models as gis_models
from django.db.models import Manager as GeoManager
from ngeo.apps.agents.models import Agent
from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.county_manager.models import CountyManager

class Installation(models.Model):
    name = models.CharField(max_length=200)
    installation_type = models.CharField(max_length=200)
    location = gis_models.PointField(srid=4326, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Installations"