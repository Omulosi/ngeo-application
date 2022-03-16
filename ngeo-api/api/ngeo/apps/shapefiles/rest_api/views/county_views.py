"""County view."""

from rest_framework import generics
from ngeo.apps.shapefiles.models import County, SubLocation
from ngeo.apps.shapefiles.rest_api.serializers import CountySerializer, SublocationSerializer
from rest_framework import filters
from .filters import CountyFilter

class CountyList(generics.ListAPIView):
    """
    API view to retrieve list of counties
    """
    serializer_class = CountySerializer
    queryset = County.objects.all()
    filterset_class = CountyFilter
    search_fields = ('counties', 'cty_code')

class CountyName(generics.ListAPIView):
    """
    API view to retrieve list of counties
    """
    serializer_class = CountySerializer

    def get_queryset(self):
        queryset = County.objects.all()
        county_name = self.kwargs.get('county_name', None)
        if county_name is not None:
            queryset = queryset.filter(counties__icontains=county_name)
        return queryset


class CountyDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one county
    """
    queryset = County.objects.all()
    serializer_class = CountySerializer
