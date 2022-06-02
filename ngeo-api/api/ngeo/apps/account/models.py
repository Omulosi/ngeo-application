from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.shortcuts import get_object_or_404
from notifications.signals import notify


from ngeo.apps.common.models import CoreModel
from . import managers


class User(PermissionsMixin, CoreModel, AbstractBaseUser):

    # roles
    ADMIN = 1
    CEO = 2
    AUDIT = 3
    FINANCE = 4
    RM = 5  # Regional Manager
    CM = 6  # County Manager
    FOO = 7  # Field Outreach Officer
    UNASSIGNED = 8
    HR = 9  # Human Resource
    DRM = 10 # Deputy RM
    DCM = 11 # Deputy CM

    ROLE_CHOICES = (
        (ADMIN, "Admin"),
        (CEO, "CEO"),
        (AUDIT, "Audit"),
        (FINANCE, "Finance"),
        (RM, "Regional Manager"),
        (CM, "County Manager"),
        (FOO, "Field Outreach Officer"),
        (UNASSIGNED, "Unassigned"),
        (HR, "Human Resource"),
        (DRM, "Deputy Regional Manager"),
        (DCM, "Deputy County Manager"),
    )

    email = models.EmailField(verbose_name=_("Email"), unique=True)
    first_name = models.CharField(verbose_name=_("first name"),
                                  max_length=30,
                                  blank=True,
                                  null=True)
    last_name = models.CharField(verbose_name=_("last name"),
                                 max_length=30,
                                 blank=True,
                                 null=True)
    staff_number = models.CharField(verbose_name=_("staff number"),
                                       max_length=30,
                                       blank=True,
                                       null=True, 
                                       unique=True)
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES,
                                            blank=True,
                                            null=True,
                                            default=8)

    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_(
            "Designates whether the user can log into this admin site."))
    is_active = models.BooleanField(
        _("active"),
        default=False,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."),
    )

    date_joined = models.DateTimeField(default=timezone.now)

    objects = managers.UserManager()

    class Meta:
        ordering = ("first_name", "last_name")

    @property
    def all_notifications(self):
        self.get_notifications()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []



    def __str__(self):
        return self.get_full_name() or self.email

    def get_short_name(self):
        if self.first_name:
            return self.first_name
        return self.email.split("@")[0]

    def get_full_name(self):
        return " ".join(filter(None, [self.first_name, self.last_name]))

    def get_notifications(self):
        return self.notifications.active()


    def delete(self):
        self.deactivate()
        super(User, self).delete()

    def send_notification_to_HR(self):
            hr_list = User.objects.filter(role=User.HR)

            for hr in hr_list:
                # Takes an actor (sender), recipient, verb 
                notify.send(
                    self,
                    recipient=hr,
                    verb=
                    f"Activate newly registered user: {self.first_name} {self.last_name} ({self.email})",
                    # Pass any extra data as key value pairs
                    user_id=self.pk
                )