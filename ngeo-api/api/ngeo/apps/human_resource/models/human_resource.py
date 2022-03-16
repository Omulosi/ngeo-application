from django.db import models
from ngeo.apps.account.models import User

class HumanResource(models.Model):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL,related_name="human_resource")
    
    def __str__(self):
        return f'{self.user.email} - Human Resource'