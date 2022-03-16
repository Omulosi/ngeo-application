from rest_framework import generics, mixins
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from ngeo.apps.account.models import User
from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.finance.models import FinanceOfficer
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.regional_manager.models import RegionalManager
from rest_framework_tracking.mixins import LoggingMixin
from notifications.signals import notify
from ngeo.apps.libs.exceptions import BadRequest
import django
import logging
from ...models import Agent
from ..serializers import AgentSerializer


logger = logging.getLogger(__name__)


class AgentListCreate(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = AgentSerializer
    queryset = Agent.objects.all()
    
    def get_queryset(self):
        user = self.request.user

        if user.role == User.RM:
            # Get agents in this CMs county only
            region_manager = get_object_or_404(RegionalManager, user=user)
            return self.queryset.filter(area__region=region_manager.area.region)
        if user.role == User.CM:
            # Get agents in this CMs county only
            county_manager = get_object_or_404(CountyManager, user=user)
            return self.queryset.filter(area__county=county_manager.area.county)
        if user.role == User.FOO:
            # Get agent in this FOOs area only
            field_officer = get_object_or_404(FieldOfficer, user=user)
            return self.queryset.filter(field_officer=field_officer)
        return self.queryset
    
    def post(self, request, *args, **kwargs):
        # Assign FOOs area to agent created by him/her.
        user = self.request.user
        try:
            if user.role == User.FOO:
                field_officer = get_object_or_404(FieldOfficer, user=request.user)
                agent = Agent.objects.create(**request.data,
                                            field_officer=field_officer, area=field_officer.area, created_by=user, reports_to=user)
                logger.critical(f'Agent {agent.first_name} {agent.last_name} created by Field Officer {field_officer.user.first_name} {field_officer.user.last_name} ({field_officer.user.staff_number}')
        
            
                
                return Response({"message": "Agent created successfuly!"},
                                status=status.HTTP_201_CREATED)

            if user.role == User.FINANCE:
            
                user = request.user
                finance_officer = get_object_or_404(FinanceOfficer, user=user)
                agent = Agent.objects.create(**request.data,
                                            finance_officer=finance_officer, created_by=user)
            
                agent.activate() # Automatically activate for finance officer
                return Response({"message": "Agent created successfuly!"},
                                status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_200_OK)
        except django.db.utils.IntegrityError:
            return Response ("ID number already exists", status=status.HTTP_400_BAD_REQUEST)
            
    
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


# class AgentListCreate(LoggingMixin, generics.ListCreateAPIView):
#     """
#     API view to retrieve list of agents
#     """

#     serializer_class = AgentSerializer
#     queryset = Agent.objects.all()

#     # LoggingMixin options:
#     logging_methods = ['POST']
#     # sensitive_fields = {''}

#     def get_queryset(self):
#         user = self.request.user

#         if user.role == User.RM:
#             # Get agents in this CMs county only
#             region_manager = get_object_or_404(RegionalManager, user=user)
#             return self.queryset.filter(area__region=region_manager.area.region)
#         if user.role == User.CM:
#             # Get agents in this CMs county only
#             county_manager = get_object_or_404(CountyManager, user=user)
#             return self.queryset.filter(area__county=county_manager.area.county)
#         if user.role == User.FOO:
#             # Get agent in this FOOs area only
#             field_officer = get_object_or_404(FieldOfficer, user=user)
#             return self.queryset.filter(field_officer=field_officer)
#         else:
#             return self.queryset

#     def create(self, request, *args, **kwargs):
#         # Assign FOOs area to agent created by him/her.
#         user = self.request.user
#         import pdb;pdb.set_trace()
#         if user.role == User.FOO:
#             field_officer = get_object_or_404(FieldOfficer, user=request.user)
#             agent = Agent.objects.create(**request.data,
#                                         field_officer=field_officer, area=field_officer.area, created_by=user, reports_to=user)
#             logger.critical(f'Agent {agent.first_name} {agent.last_name} created by Field Officer {field_officer.user.first_name} {field_officer.user.last_name} ({field_officer.user.staff_number}')
    
        
            
#             return Response({"message": "Agent created successfuly!"},
#                             status=status.HTTP_201_CREATED)

#         if user.role == User.FINANCE:
           
#             user = request.user
#             finance_officer = get_object_or_404(FinanceOfficer, user=user)
#             agent = Agent.objects.create(**request.data,
#                                         finance_officer=finance_officer, created_by=user)
        
#             agent.activate() # Automatically activate for finance officer
#             return Response({"message": "Agent created successfuly!"},
#                             status=status.HTTP_201_CREATED)



# Superflous: push this code to class above, use conditionals to check for roles and respond
# appropriately.
class FieldOfficerAgentList(generics.ListAPIView):
    """
    API view to retrieve list of agents for currently
    logged in field office requesting this resource.
    """

    serializer_class = AgentSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            field_officer = get_object_or_404(FieldOfficer, user=user)
            # return field_officer.agents.all()
            return Agent.objects.filter(area=field_officer.area)
        except:
            return []

class AgentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve one agent
    """

    queryset = Agent.objects.all()
    serializer_class = AgentSerializer


class UpdateAgentTerms(LoggingMixin, APIView):
    """
    Updates employment terms of agent.
    """
    def patch(self, request, pk):
        data = request.data
        user = request.user
        #
        # Approval
        #
        terms = data.get("type") # permanent_hq/county, contract
        sender_pk = data.get("sender")
        is_approved = data.get("is_approved") == 'true'
        is_denied = not is_approved # data.get("is_denied")
        # Reason for denying contract terms
        denial_reason = data.get("denial_reason")
        # Reason for denying permanent terms
        # permanent_deny = data.get("permanent_deny")
        try:
            agent = get_object_or_404(Agent, pk=pk)
            if terms.lower() == "contract":
                agent.approve_to_contract(
                    user=user, 
                    is_approved=is_approved,
                    is_denied=is_denied,
                    sender_pk=sender_pk,
                    denial_reason=denial_reason
                )
            # if terms.lower() == "permanent":
            #     agent.update_to_permanent(request.user, reason, sender,
            #                               permanent_deny)
            agent.save()
            return Response("Approval request sent",
                            status=status.HTTP_200_OK)
        except Exception as err:
            raise

class DeleteAgent(LoggingMixin, APIView):
    def patch(self, request, pk):
        user = self.request.user
        delete_reason = request.data.get('delete_reason')
        approve_delete = request.data.get('approve_delete')
        sender = request.data.get('sender')
        denial_reason = request.data.get('denial_reason')
        agent = get_object_or_404(Agent, pk=pk)

        if user.role == User.FINANCE:
            # Finance officer
            agent = get_object_or_404(Agent, pk=pk)
            agent.delete_reason = delete_reason
            agent.deleted_by = user
            agent.save()
            agent.delete()

            logger.critical( f"Agent {agent.first_name} {agent.last_name} deactivated by the Finance Officer {user.first_name} {user.last_name} ({user.staff_number}). Reason: {delete_reason}")
            
            return Response({"message": "Agent successfuly deleted!"},
                                status=status.HTTP_200_OK)

        if user.role == User.FOO:
            # FOO
            # Does not delete
            # Send notification to CM who does the actual deletion
            agent.approve_agent_deletion(
                user=request.user, 
                sender=sender,
                approve_delete=approve_delete, 
                denial_reason=denial_reason, 
                delete_reason=delete_reason
                )
            agent.save()
            return Response({"message": "Agent successfuly deleted!"},
                                status=status.HTTP_200_OK)

        if user.role == User.CM:
            # CM
            # Approves/denies deletion

            county_manager = get_object_or_404(CountyManager, user=user)

            # Handle delete request from FOO
            if approve_delete and sender:
                agent.approve_agent_deletion(
                        user=request.user, 
                        sender=sender,
                        approve_delete=approve_delete, 
                        denial_reason=denial_reason, 
                        delete_reason=delete_reason
                        )
          
         
            # Deny delete approval 
            # Todo: send notification to this effect to FOO in question
            if not approve_delete and sender:
                agent.delete_reason = delete_reason
                agent.deleted_by = user
                # deselect approve_delete field to show request has been handled
                agent.approve_delete = False
                # Reason for denying deletion, set this to None when deletion is approved
                agent.deny_approve_delete_message = denial_reason
                agent.save()
                # Assume sender is a Field Officer
                approve_delete_request_sender = get_object_or_404(FieldOfficer, pk=sender)
                recipient = get_object_or_404(User,
                                              field_officer=approve_delete_request_sender)

                message = f"Deactivation request for {agent.first_name} {agent.last_name} has been denied"

                logger.critical( f"Deactivation request for the Agent {agent.first_name} {agent.last_name} denied by the County Manager {county_manager.user.first_name} {county_manager.user.last_name}. Denial Reason: {denial_reason}. Request sent by the Field Officer: {recipient.first_name} {recipient.last_name}")

                # Send notification to FOO who sent approve delete request
                notify.send(
                    county_manager, 
                    recipient=recipient,
                    verb=message,
                    agent=agent.id,
                    denial_reason=denial_reason
                )
            
            # Delete directly as CM
            if not sender:
                agent.delete_reason = delete_reason
                agent.deleted_by = user
                # deselect approve_delete field to show request has been handled
                agent.approve_delete = False
                agent.deny_approve_delete_message = None
                agent.save()
                agent.delete()
                logger.critical( f"Agent {agent.first_name} {agent.last_name} deactivated by the County Manager {county_manager.user.first_name} {county_manager.user.last_name}. Reason: {delete_reason}")
            return Response({"message": "Agent successfuly deleted!"},
                                status=status.HTTP_200_OK)
            