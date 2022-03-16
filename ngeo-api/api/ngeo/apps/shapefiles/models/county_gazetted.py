# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class CountyGazetted(models.Model):
    const_nam = models.CharField(max_length=50, blank=True, null=True)
    const_no = models.BigIntegerField(blank=True, null=True)
    county_nam = models.CharField(max_length=50, blank=True, null=True)
    st_area_sh = models.FloatField(blank=True, null=True)
    st_length_field = models.FloatField(blank=True, null=True)
    counties = models.CharField(max_length=30, blank=True, null=True)
    count = models.BigIntegerField(blank=True, null=True)
    country = models.CharField(max_length=16, blank=True, null=True)
    area_sqkm = models.FloatField(blank=True, null=True)
    color_code = models.CharField(max_length=50, blank=True, null=True)
    data_colle = models.CharField(max_length=50, blank=True, null=True)
    phase = models.CharField(max_length=50, blank=True, null=True)
    geom = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return self.counties

    class Meta:
        verbose_name_plural = "Counties - Gazetted"