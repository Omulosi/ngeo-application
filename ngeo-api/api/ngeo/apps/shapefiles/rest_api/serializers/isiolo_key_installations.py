from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ...models import IsioloKeyInstallation


class IsioloKeyInstallationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = IsioloKeyInstallation
        geo_field = "geom"
        fields = '__all__'
