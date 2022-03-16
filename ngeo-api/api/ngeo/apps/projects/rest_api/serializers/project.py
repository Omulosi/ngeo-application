from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.themes.models import Theme
from ...models import Project


class ProjectSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Project
        geo_field = "location"
        fields = '__all__'
        # exclude = ('description', )
        depth = 2

class ProjectDetailSerializer(serializers.ModelSerializer):   
    class Meta:
        model = Project
        fields = '__all__'
        depth = 2