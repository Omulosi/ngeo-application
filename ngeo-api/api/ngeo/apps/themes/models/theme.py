from django.db import models


class Theme(models.Model):

    name = models.CharField(max_length=200)
    color = models.CharField(max_length=10, default='#00f')
        
    def __str__(self):
        return self.name