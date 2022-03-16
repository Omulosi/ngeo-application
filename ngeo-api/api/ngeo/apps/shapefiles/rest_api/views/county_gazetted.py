"""County view."""

from rest_framework import generics, permissions
from ngeo.apps.shapefiles.models import CountyGazetted
from ngeo.apps.shapefiles.rest_api.serializers import CountyGazettedSerializer
from .filters import CountyFilter


class CountyList(generics.ListAPIView):
    """
    API view to retrieve list of counties
    """
    serializer_class = CountyGazettedSerializer
    queryset = CountyGazetted.objects.all()
    filterset_class = CountyFilter
    search_fields = ('counties',)
    permission_classes = (permissions.AllowAny, )


class CountyDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one county
    """
    queryset = CountyGazetted.objects.all()
    serializer_class = CountyGazettedSerializer
