from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.shapefiles.models import Region


class RegionSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Region
        geo_field = "geom"
        fields = '__all__'
