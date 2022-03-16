from rest_framework import serializers
from ngeo.apps.county_manager.rest_api.serializers import CountyManagerSerializer
from ...models import RegionalManager

class RegionalManagerSerializer(serializers.ModelSerializer):
    county_managers = CountyManagerSerializer(many=True, required=False)

    class Meta:
        model = RegionalManager
        fields = '__all__'
        depth = 2