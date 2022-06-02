from django.db import models
from ngeo.apps.account.models import User
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.common.models import Area
from notifications.signals import notify

import logging

logger = logging.getLogger(__name__)

class FieldOfficer(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL, blank=True, related_name="field_officer")
    county_manager = models.ForeignKey(CountyManager, on_delete=models.SET_NULL, blank=True, null=True, related_name="field_officers")
    area = models.OneToOneField(Area, on_delete=models.CASCADE, null=True, blank=True, related_name="field_officer_area")

    def send_notification_to_CM(self, county):
            county_manager_list = CountyManager.objects.filter(area__county__iexact=county)

            for cm in county_manager_list:
                # Takes an actor (sender), recipient, verb 
                notify.send(
                    self,
                    recipient=cm.user,
                    verb=
                    f"A new field officer has been assigned to this county: {self.user.first_name} {self.user.last_name} ({self.user.email})",
                    # Pass any extra data as key value pairs
                    user_id=self.user.pk
                )

                print(f" NOIFICATION OF A NEWLY ASSIGNED FIELD OFFICER SENT TO COUNTY MANAGER: {cm} - {county}")
    
    def __str__(self):
        return f'{self.user.email} - FOO '