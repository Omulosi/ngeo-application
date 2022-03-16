from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.shapefiles.models import CountyGazetted


class CountyGazettedSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = CountyGazetted
        geo_field = "geom"
        fields = '__all__'
