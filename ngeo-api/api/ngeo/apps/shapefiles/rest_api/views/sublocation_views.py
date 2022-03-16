"""Sublocation view."""

from rest_framework import generics
from ngeo.apps.shapefiles.models import SubLocation
from ngeo.apps.shapefiles.rest_api.serializers import SublocationSerializer
import rest_framework_filters

from .filters import SublocationFilter

class SubLocationList(generics.ListAPIView):
    """
    API view to retrieve list of sublocation
    """
    queryset = SubLocation.objects.all()
    serializer_class = SublocationSerializer
    filter_backends = (rest_framework_filters.backends.ComplexFilterBackend, )
    filterset_class = SublocationFilter
    search_fields = ('locname', 'divname', 'distname', 'provname', 'sub_name', )
class SubLocationDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one sublocation
    """
    queryset = SubLocation.objects.all()
    serializer_class = SublocationSerializer
    filterset_fields = ('locname', 'divname', 'distname', 'provname', 'sub_name',)

class SubLocationName(generics.ListAPIView):
    """
    API view to retrieve list of sublocation by name
    """
    serializer_class = SublocationSerializer

    def get_queryset(self):
        queryset = SubLocation.objects.all()
        sublocation_name = self.kwargs.get('sublocation_name', None)
        if sublocation_name is not None:
            queryset = queryset.filter(sub_name__iexact=sublocation_name)
        return queryset
