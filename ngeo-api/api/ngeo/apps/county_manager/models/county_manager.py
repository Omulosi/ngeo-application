from django.db import models
from ngeo.apps.account.models import User
from ngeo.apps.common.models import Area
from ngeo.apps.regional_manager.models import RegionalManager


class CountyManager(models.Model):
    user = models.OneToOneField(User,
                                on_delete=models.SET_NULL,
                                null=True,
                              related_name="county_manager")
    
    area = models.OneToOneField(Area,
                                on_delete=models.SET_NULL, null=True, blank=True,
                                related_name="cm_area")
    regional_manager = models.ForeignKey(RegionalManager,
                                         on_delete=models.SET_NULL,
                                         blank=True,
                                         null=True,
                                         related_name="county_managers")

    def update_county(self, county_name):
        self.area.county = county_name
        self.area.save()
        
    def __str__(self):
        return f"{self.user.email} - CM "
