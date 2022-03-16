from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.shapefiles.models import SubLocation


class SublocationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = SubLocation
        geo_field = "geom"
        fields = '__all__'
