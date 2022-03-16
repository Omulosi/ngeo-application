"""Office view."""

from rest_framework import generics
from ngeo.apps.shapefiles.models import OutreachOfficer
from ngeo.apps.shapefiles.rest_api.serializers import OfficeSerializer


class OfficeList(generics.ListAPIView):
    """
    API view to retrieve list
    """
    serializer_class = OfficeSerializer
    queryset = OutreachOfficer.objects.all()


class OfficeDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one
    """
    queryset = OutreachOfficer.objects.all()
    serializer_class = OfficeSerializer
