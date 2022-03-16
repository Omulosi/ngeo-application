from rest_framework import generics
from django.contrib.gis.geos import fromstr
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..serializers import IncidentSerializer, IncidentDetailSerializer
from ...models import Incident
from .filters import IncidentFilter


class IncidentListCreate(generics.ListCreateAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    filterset_class = IncidentFilter
    search_fields = ("title", )

    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            longitude = data.get("longitude")
            latitude = data.get("latitude")
            # location = [float(l) for l in location.split(',')]
            # longitude, latitude = [-1.308889970195843, 36.81149482214762]
            location = fromstr(f"POINT({longitude} {latitude})", srid=4326)
            data["location"] = location
            incident = Incident.objects.create(**data)

            return Response({"message": "Incident created successfuly!"},
                            status=status.HTTP_201_CREATED)
        except:
            raise
            # return Response({"message": "Error adding new incident"},
            #                status=status.HTTP_400_BAD_REQUEST)


class IncidentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentDetailSerializer
