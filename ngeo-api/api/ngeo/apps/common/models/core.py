from uuid import uuid4

from django.db import models
# from ngeo.apps.account.models import User
from safedelete.models import SafeDeleteModel
from safedelete.queryset import SafeDeleteQueryset
from safedelete.managers import SafeDeleteManager
from django.utils.translation import gettext_lazy as _


class CoreQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def inactive(self):
        return self.filter(is_active=False)

    def not_deleted(self):
        return self.filter(deleted=None)


class CoreManager(SafeDeleteManager):
    def get_queryset(self):
        return CoreQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()

    def inactive(self):
        return self.get_queryset().inactive()

    def not_deleted(self):
        return self.get_queryset().not_deleted()

class CommonCoreModel(SafeDeleteModel):
    created = models.DateTimeField(auto_now_add=True, db_index=True, verbose_name=_("created"))
    updated = models.DateTimeField(auto_now=True, verbose_name=_("updated"))
    is_active = models.BooleanField(default=False, db_index=True)

    objects = CoreManager()

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.pk)

    def __repr__(self):
        return f"<{self.__class__.__name__} {self.pk}>"

    def activate(self):
        if not self.is_active:
            self.is_active = True
            self.save(update_fields=["is_active", "updated"] if self.pk else None)

    def deactivate(self):
        if self.is_active:
            self.is_active = False
            self.save(update_fields=["is_active", "updated"] if self.pk else None)


class CoreModel(CommonCoreModel):

    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    class Meta:
        abstract = True
