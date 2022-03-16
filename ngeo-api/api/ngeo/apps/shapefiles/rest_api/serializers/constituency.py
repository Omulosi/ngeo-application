from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.shapefiles.models import Constituency


class ConstituencySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Constituency
        geo_field = "geom"
        fields = '__all__'
