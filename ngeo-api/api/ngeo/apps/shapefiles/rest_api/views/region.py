"""Office view."""

from rest_framework import generics, permissions
from ngeo.apps.shapefiles.models import Region
from ngeo.apps.shapefiles.rest_api.serializers import RegionSerializer


class RegionList(generics.ListAPIView):
    """
    API view to retrieve list
    """
    serializer_class = RegionSerializer
    permission_classes = [permissions.AllowAny, ]
    queryset = Region.objects.all()


class RegionDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one
    """
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
