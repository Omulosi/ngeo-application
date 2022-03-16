from rest_framework import serializers
from django.contrib.gis.geos import fromstr
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ...models import Incident


class IncidentSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Incident
        geo_field = "location"
        fields = "__all__"
        depth = 2


class IncidentDetailSerializer(serializers.ModelSerializer):

    # def update(self, instance, validated_data):
    #     import pdb; pdb.set_trace()
        
    class Meta:
        model = Incident
        fields = '__all__'
        depth = 2