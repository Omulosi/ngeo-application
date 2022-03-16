from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ngeo.apps.shapefiles.models import OutreachOfficer


class OfficeSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = OutreachOfficer
        geo_field = "geom"
        fields = '__all__'
