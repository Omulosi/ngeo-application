"""Constituency view"""

from rest_framework import generics
from ngeo.apps.shapefiles.models import Constituency
from ngeo.apps.shapefiles.rest_api.serializers import ConstituencySerializer


class ConstituencyList(generics.ListAPIView):
    """
    API view to retrieve list of constituencies
    """
    queryset = Constituency.objects.all()
    serializer_class = ConstituencySerializer
    search_fields = ('const_nam',)


class ConstituencyDetail(generics.RetrieveAPIView):
    """
    API view to retrieve a constituency
    """
    queryset = Constituency.objects.all()
    serializer_class = ConstituencySerializer
