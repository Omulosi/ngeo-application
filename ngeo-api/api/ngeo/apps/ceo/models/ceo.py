from django.db import models
from ngeo.apps.account.models import User

class CEOModel(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL, related_name="ceo")

    class Meta:
        verbose_name_plural = "CEOs"
    
    def __str__(self):
        return f'{self.user.email} - CEO'