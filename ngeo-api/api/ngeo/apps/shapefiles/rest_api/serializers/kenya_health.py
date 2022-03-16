from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.shapefiles.models import KenyaHealth


class KenyaHealthSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = KenyaHealth
        geo_field = "geom"
        fields = '__all__'
