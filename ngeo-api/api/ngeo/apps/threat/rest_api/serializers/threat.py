from rest_framework import serializers
from django.contrib.gis.geos import fromstr
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ...models import Threat


class ThreatSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Threat
        geo_field = "location"
        fields = "__all__"
        depth = 1

class ThreatDetailSerializer(serializers.ModelSerializer):
        
    class Meta:
        model = Threat
        fields = '__all__'
        depth = 2
