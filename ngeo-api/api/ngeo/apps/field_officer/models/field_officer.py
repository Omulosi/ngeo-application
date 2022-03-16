from django.db import models
from ngeo.apps.account.models import User
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.common.models import Area

class FieldOfficer(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL, blank=True, related_name="field_officer")
    county_manager = models.ForeignKey(CountyManager, on_delete=models.SET_NULL, blank=True, null=True, related_name="field_officers")
    area = models.OneToOneField(Area, on_delete=models.CASCADE, null=True, blank=True, related_name="field_officer_area")
    
    def __str__(self):
        return f'{self.user.email} - FOO '