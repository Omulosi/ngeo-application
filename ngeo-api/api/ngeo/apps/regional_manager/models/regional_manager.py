from django.db import models
from ngeo.apps.account.models import User
from ngeo.apps.common.models import Area

class RegionalManager(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="regional_manager")
    area = models.OneToOneField(Area, on_delete=models.SET_NULL, null=True, blank=True, related_name="rm_area")

    def __str__(self):
        return f'{self.user.email} - Regional Manager'