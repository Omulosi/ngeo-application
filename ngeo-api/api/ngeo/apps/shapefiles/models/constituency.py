# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class Constituency(models.Model):
    const_nam = models.CharField(max_length=50)
    const_no = models.BigIntegerField()
    county_nam = models.CharField(max_length=50)
    st_area_sh = models.FloatField()
    st_length_field = models.FloatField()
    geom = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return self.const_nam

    class Meta:
        verbose_name_plural = "Constituencies"


# Auto-generated `LayerMapping` dictionary for Constituency model
constituency_mapping = {
    'const_nam': 'CONST_NAM',
    'const_no': 'CONST_NO',
    'county_nam': 'COUNTY_NAM',
    'st_area_sh': 'ST_AREA_SH',
    'st_length_field': 'ST_LENGTH_',
    'geom': 'MULTIPOLYGON',
}
