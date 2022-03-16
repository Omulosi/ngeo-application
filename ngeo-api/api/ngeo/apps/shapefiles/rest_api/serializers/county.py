from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.shapefiles.models import County


class CountySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = County
        geo_field = "geom"
        fields = '__all__'
