from django.db import models
from django.contrib.postgres.fields import ArrayField

class Area(models.Model):
    sub_location = ArrayField(models.CharField(max_length=200),
                              blank=True,
                              null=True)
    location = ArrayField(models.CharField(max_length=200),
                          blank=True,
                          null=True)
    district = ArrayField(models.CharField(max_length=200),
                          blank=True,
                          null=True)
    division = ArrayField(models.CharField(max_length=200),
                          blank=True,
                          null=True)
    sub_county = ArrayField(models.CharField(max_length=200),
                            blank=True,
                            null=True)
    county = models.CharField(max_length=200, blank=True, null=True)
    region = models.CharField(max_length=200, blank=True, null=True)
    ward = ArrayField(models.CharField(max_length=200), blank=True, null=True)
    constituency = ArrayField(models.CharField(max_length=200),
                              blank=True,
                              null=True)

    def __str__(self):
        return f"County: {self.county}, SubCounty: {self.sub_county}, Location: {self.location}, SubLocation: {self.sub_location}"

    class Meta:
        verbose_name_plural = "areas"
