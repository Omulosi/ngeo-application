from django.contrib.gis.db import models


class KenyaSubCounty(models.Model):
    ctypcode = models.CharField(max_length=254)
    county = models.CharField(max_length=254)
    subcounty = models.CharField(max_length=254)
    geom = models.MultiPolygonField(srid=4326)
