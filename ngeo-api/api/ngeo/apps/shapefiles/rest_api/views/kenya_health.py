"""Kenya health view."""

from rest_framework import generics, permissions
from ngeo.apps.shapefiles.models import KenyaHealth
from ngeo.apps.shapefiles.rest_api.serializers import KenyaHealthSerializer


class KenyaHealthList(generics.ListAPIView):
    """
    API view to retrieve list
    """
    serializer_class = KenyaHealthSerializer
    # permission_classes = [permissions.AllowAny, ]
    queryset = KenyaHealth.objects.all()


class KenyaHealthDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one
    """
    queryset = KenyaHealth.objects.all()
    serializer_class = KenyaHealthSerializer
