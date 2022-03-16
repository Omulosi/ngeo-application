from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
import logging
from ngeo.apps.account.models import User
from ngeo.apps.agents.models import Agent
from ...models import FieldOfficer
from ..serializers import FieldOfficerSerializer
from notifications.signals import notify
from ngeo.apps.county_manager.models import CountyManager

logger = logging.getLogger(__name__)


class FieldOfficerList(generics.ListCreateAPIView):
    """
    API view to retrieve list of field officers
    """
    serializer_class = FieldOfficerSerializer
    queryset = FieldOfficer.objects.all()

    def get_queryset(self):
        # Return all field officers if user has HR role
        # otherwise return user specific field officer list
        user = self.request.user
        if user.role == User.HR:
            return self.queryset
        if user.role == User.CM:
            county_manager = get_object_or_404(CountyManager, user=user)
            # Return all Active FOOs within this county
            return self.queryset.filter(area__county=county_manager.area.county, user__is_active=True)
        return self.queryset.filter(user__role=User.FOO)


class FieldOfficerDetail(generics.RetrieveDestroyAPIView):
    """
    """
    serializer_class = FieldOfficerSerializer
    queryset = FieldOfficer.objects.all()

    def patch(self, request, pk):
        # Assign agent to field officer
        user = self.request.user

        # only CM can do this
        if user.role == User.CM:
            agent_id = request.data.get('agent')
            field_officer = self.get_object()
            if agent_id:
                agent = get_object_or_404(Agent, pk=agent_id)
                field_officer.agents.add(agent)
                field_officer.save()
                # Log this operation
                logger.critical(f"Agent {agent.first_name} {agent.last_name} assigned to Field Officer {field_officer.user.first_name} {field_officer.user.last_name}. Operation performed by {user.first_name} {user.last_name} (staff No: {user.staff_number})")
                return Response({"message": "Agent successfuly assigned to FOO!"},
                            status=status.HTTP_200_OK)
        # Proceed as usual for default case
        return super().patch(request, pk)



class Me(generics.RetrieveAPIView):
    """
    Retrieves currently logged in field officer
    """

    serializer_class = FieldOfficerSerializer

    def get_object(self):
        user = self.request.user
        field_officer = get_object_or_404(FieldOfficer, user=user)
        return field_officer
