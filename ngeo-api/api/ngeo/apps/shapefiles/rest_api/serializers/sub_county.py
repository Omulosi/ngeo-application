from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.shapefiles.models import KenyaSubCounty


class KenyaSubCountySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = KenyaSubCounty
        geo_field = "geom"
        fields = '__all__'
