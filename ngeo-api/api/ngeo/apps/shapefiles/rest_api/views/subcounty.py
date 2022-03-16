"""Kenya health view."""

from rest_framework import generics, permissions
from ngeo.apps.shapefiles.models import KenyaSubCounty
from ngeo.apps.shapefiles.rest_api.serializers import KenyaSubCountySerializer


class KenyaSubcountyList(generics.ListAPIView):
    """
    API view to retrieve list
    """
    serializer_class = KenyaSubCountySerializer
    # permission_classes = [permissions.AllowAny, ]
    queryset = KenyaSubCounty.objects.all()


class KenyaSubcountyDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one
    """
    queryset = KenyaSubCounty.objects.all()
    serializer_class = KenyaSubCountySerializer
