from django.contrib.auth.models import BaseUserManager

from ngeo.apps.common import models as core_models


class UserManager(core_models.CoreManager, BaseUserManager):
    def get_queryset(self):
        return core_models.CoreQuerySet(self.model, using=self._db)

    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, **kwargs):
        kwargs.setdefault('role', 1) # superuser is a global admin
        # if extra_fields.get('role') != 1:
        #     raise ValueError('Superuser must have role of Global Admin')
        user = self.create_user(**kwargs)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)

        return user
