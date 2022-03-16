from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ...models import IsioloProject


class IsioloProjectsSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = IsioloProject
        geo_field = "geom"
        fields = '__all__'
