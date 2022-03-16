from django.db import models
from ngeo.apps.account.models import User

class FinanceOfficer(models.Model):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="finance_officer")
    
    def __str__(self):
        return f'{self.user.email} - Finance Officer'