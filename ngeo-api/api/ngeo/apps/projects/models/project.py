from django.contrib.gis.db import models as gis_models
from django.db import models
from django.shortcuts import get_object_or_404
from django.utils import timezone
from ngeo.apps.account.models import User
from ngeo.apps.agents.models import Agent
from ngeo.apps.common.models import Area, CommonCoreModel
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.themes.models import Theme
from notifications.signals import notify
from safedelete.models import SOFT_DELETE, SafeDeleteModel

NONE = 0
BUSINESS_INCUBATION = 1
AGRI_BUSINESS = 2
WATER_SANITATION = 3
HEALTH = 4

THEME_CHOICES = (
    (NONE, ""),
    (BUSINESS_INCUBATION, "BUSINESS INCUBATION"),
    (AGRI_BUSINESS, "AGRI-BUSINESS"),
    (WATER_SANITATION, "WATER-SANITATION"),
    (HEALTH, "HEALTH"),
)

# Initiated by
NONE = ''
HQ = 'HQ'
COUNTY = 'COUNTY'

INITIATED_BY_CHOICES = (
    (NONE, ''),
    (HQ, 'HQ'),
    (COUNTY, 'COUNTY'),
)

class Project(CommonCoreModel):

    name = models.CharField(max_length=200)
    theme = models.ForeignKey(Theme, on_delete=models.SET_NULL, blank=True, null=True, related_name="projects_theme")
    initiated_by = models.CharField(max_length=10, choices=INITIATED_BY_CHOICES, blank=True, null=True, default='')
    description = models.TextField(null=True, blank=True)
    date_added = models.DateTimeField(null=True, blank=True, default=timezone.now)
    agent = models.ManyToManyField(Agent, blank=True, null=True, related_name="projects")
    field_officer = models.ForeignKey(
        FieldOfficer, on_delete=models.SET_NULL, blank=True, null=True, related_name="projects"
    )
    county_manager = models.ForeignKey(
        CountyManager, on_delete=models.SET_NULL, blank=True, null=True, related_name="projects"
    )
    longitude = models.CharField(max_length=50, null=True, blank=True)
    latitude = models.CharField(max_length=50, null=True, blank=True)
    # Will make it easier to get data by region or county from geoserver.
    county = models.CharField(max_length=250, null=True, blank=True)
    region = models.CharField(max_length=250, null=True, blank=True)
    #
    area = models.ForeignKey(Area,
                             on_delete=models.SET_NULL,
                             null=True,
                             blank=True,
                             related_name="project_area")

    delete_reason = models.TextField(max_length=1000, null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    deleted_by = models.ForeignKey(User,
                                   blank=True,
                                   null=True,
                                   on_delete=models.SET_NULL,
                                   related_name="project_deleter")

    location = gis_models.PointField(srid=4326, null=True, blank=True)

    def __str__(self):
        return self.name

    def send_notification_to_CM(self, sender, county=None):
            cm_list = CountyManager.objects.filter(area__county=county)

            for cm in cm_list:
                recipient = get_object_or_404(User, county_manager=cm)
                # Takes an actor (sender), recipient, verb
                notify.send(
                    sender,
                    recipient=recipient,
                    verb=
                    f"The project '{self.name}' has been assigned to this county by: {sender.email}",
                    # Pass any extra data as key value pairs
                    project_id=self.pk
                )

    def delete(self):
        self.deactivate()
        super(Project, self).delete()

    class Meta:
        verbose_name_plural = "Projects"
