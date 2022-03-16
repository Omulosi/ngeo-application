from rest_framework import generics
from rest_framework.views import APIView
from django.contrib.gis.geos import LineString
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.account.models import User
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.regional_manager.models import RegionalManager
from django.db.models import Q
import logging
from ..serializers import ThreatSerializer, ThreatDetailSerializer
from ...models import Threat
# from .filters import IncidentFilter

logger = logging.getLogger(__name__)


class ThreatListCreate(generics.ListCreateAPIView):
    queryset = Threat.objects.all()
    serializer_class = ThreatSerializer
    # filterset_class = IncidentFilter
    # search_fields = ("name", )

    def get_queryset(self):
        # Return projects matching this users area
        user = self.request.user
       
        if user.role == User.RM:
            regional_manager = get_object_or_404(RegionalManager, user=user)
            # Return all Threats within this region
            
            return self.queryset.filter(to_region=regional_manager.area.region)
        if user.role == User.CM:
            county_manager = get_object_or_404(CountyManager, user=user)
            # Return all Threats within this county
            return self.queryset.filter(Q(destination=county_manager.area.county) | Q(origin=county_manager.area.county))

        if user.role == User.FOO:
            field_officer = get_object_or_404(FieldOfficer, user=user)
            return self.queryset.filter(Q(destination=field_officer.area.county) | Q(origin=field_officer.area.county))
        
        return self.queryset

    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            user = request.user
            # field_officer_id = request.data.get('field_officer')
            line_data = data.get("location") 
     
            if line_data:
                line_data = LineString((line_data))
                data["location"] = line_data
            threat = Threat.objects.create(**data)
            logger.critical(f"The Threat {threat.name} successfully created by the User {user.first_name} {user.last_name} (Staff No: {user.staff_number})")
        
            return Response({"message": "Threat successfuly added!"},
                            status=status.HTTP_201_CREATED)
        except:
            raise


class ThreatDetail(generics.RetrieveUpdateAPIView):
    queryset = Threat.objects.all()
    serializer_class = ThreatDetailSerializer


class DeleteThreat(APIView):
    def patch(self, request, pk):
        user = request.user
        reason = request.data.get('delete_reason')
        threat = get_object_or_404(Threat, pk=pk)
        threat.delete_reason = reason
        threat.save()
        threat.delete()
        logger.critical(f"The Threat {threat.name} successfully deleted by the User {user.first_name} {user.last_name} (Staff No: {user.staff_number})")
        return Response({"message": "Project successfuly deleted!"},
                            status=status.HTTP_200_OK)