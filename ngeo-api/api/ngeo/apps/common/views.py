from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ngeo.apps.account.models import User
from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.regional_manager.models import RegionalManager
from ngeo.apps.agents.models import Agent
from ngeo.apps.projects.models import Project
from .serializers import AreaSerializer, NotificationSerializer
from .models import Area
from notifications.models import Notification
import logging

logger = logging.getLogger(__name__)


class AreaListCreate(generics.ListCreateAPIView):
    """
    API view to retrieve list of agents
    """

    serializer_class = AreaSerializer
    queryset = Area.objects.all()


class AreaDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve one agent
    """

    queryset = Area.objects.all()
    serializer_class = AreaSerializer


class MyAreaList(APIView):
    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        areas = []
        if user.role == User.FOO:
            areas = Area.objects.filter(field_officer__user=user)
        if user.role == User.CM:
            areas = Area.objects.filter(county_manager__user=user)
        data = AreaSerializer(areas, many=True).data
        return Response(data)


class MyNotificationList(APIView):
    def get(self, request):
        user = self.request.user
        notifications = user.get_notifications()
        data = NotificationSerializer(notifications, many=True).data

        return Response(data)


class NotificationDetail(APIView):
    """
    Marks a notification as read.
    """
    def patch(self, request, pk):
        user = self.request.user
        try:
            notification = user.notifications.get(id=int(pk))
            notification.mark_as_read()
            notification.save()
            data = NotificationSerializer(notification).data
            return Response(data)
        except Notification.DoesNotExist:
            return Response("Error getting notification",
                            status.HTTP_400_BAD_REQUEST)


class AssignArea(APIView):
    """
    Assign area
    """
    def patch(self, request):

        try:
            data = request.data
            # Find user being assigned an area
            user_id = data.get("user_id")
            role = data.get('user_role')
            # Agent is not a User, skip user with this role to avoid getting errors
            # when below statement is run.
            user = not(role == 'agent') and user_id and User.objects.filter(pk=user_id).get()

            # Find project being assigned an area
            project_id = data.get('project_id')
            
            #
            # Assignee is County Manager
            #
            if user and user.role == User.CM:
                region = data.get('region')
                county = data.get("county").pop()
                county_manager = get_object_or_404(CountyManager, user=user)
                # Check if CM already had an area assigned to them, in this
                # case a new county will be assigned to them
                if county_manager.area:
                    county_manager.area.region = region
                    county_manager.area.county = county
                # Area being assigned for the first time
                # Create a new area instance and assign it
                if county_manager.area is None:
                    area = Area(region=region, county=county)
                    county_manager.area = area
                county_manager.area.save()
                county_manager.save()
                return Response("Area successfuly assigned to county manager",
                                status=status.HTTP_200_OK)
            #
            # Assignee is Regional Manager
            #
            if user and user.role == User.RM:
                region = data.get("region")
                region_manager = get_object_or_404(RegionalManager, user=user)
                if region_manager.area:
                    region_manager.area.region = region
                if region_manager.area is None:
                    area = Area(region=region)
                    region_manager.area = area
                region_manager.area.save()
                region_manager.save()
                return Response(
                    "Area successfuly assigned to regional manager",
                    status=status.HTTP_200_OK)
            #
            # Assignee is Field Officer
            #
            if user and user.role == User.FOO:
                # 
                region = data.get('region')
                county = data.get("county")
                
                if county:
                    county = county.pop()
                constituencies = [c for c in data.get("constituency", []) if c]
                sub_counties = [sc for sc in data.get("sub_county", []) if sc]
                divisions = [div for div in data.get("division", []) if div]
                locations = [l for l in data.get("location", []) if l]
                sub_locations = [sub for sub in data.get("sub_location", []) if sub]
                # wards = [w for w in data.get("ward", []) if w]
                # districts = [d for d in data.get("district", []) if d]
                # sub_counties = [s for s in data.get("sub_county", []) if s]

                field_officer = get_object_or_404(FieldOfficer, user=user)
                new_county_assigned = False
                
                # Updating field officer area
                if field_officer.area:
                    # only update areas whose values are provided for
                    if county or region:
                        # For county updates, set all other sub-areas to null. The new CM will re-assign these afresh
                        # depending on their county
                        area = Area(region=region, county=county)
                        field_officer.area = area
                        new_county_assigned = True
                    # Assign these areas if field officer hasnt been given a new county
                    # Skip if a new county has been given to FOO.
                    if not new_county_assigned:
                        field_officer.area.constituency = constituencies
                        field_officer.area.sub_county = sub_counties
                        field_officer.area.division = divisions
                        field_officer.area.location = locations
                        field_officer.area.sub_location = sub_locations

                    if new_county_assigned:
                        # Clear FOOs agents and projects
                        # These will be re-assigned to them by the new areas
                        # CM
                        field_officer.agents.clear()
                        field_officer.projects.clear()
                        field_officer.user.notifications.mark_all_as_deleted()

                # Assigning new area to field officer
                if field_officer.area is None:
                    area = Area(
                        region=region,
                        county=county,
                        constituency=constituencies,
                        sub_county=sub_counties,
                        division=divisions,
                        location=locations,
                        sub_location=sub_locations,
                       )
                    field_officer.area = area
                # save area
                field_officer.area.save()
                field_officer.save()

                return Response("Area successfuly assigned to field officer",
                                status=status.HTTP_200_OK)
            #
            # Assigness is an Agent
            #
            if role == "agent":
                # Get areas
                county = data.get("county")
                if county:
                    county = county.pop()
                sub_counties = [s for s in data.get("sub_county", []) if s]
                locations = [l for l in data.get("location", []) if l]
                sub_locations = [sub for sub in data.get("sub_location", []) if sub]
                wards = [w for w in data.get("ward", []) if w]
                constituencies = [c for c in data.get("constituency", []) if c]
                districts = [d for d in data.get("district", []) if d]

                agent = get_object_or_404(Agent, pk=user_id)

                # Upating area
                if agent.area:
                    # only update areas whose values are provided for
                    if county:
                        # For county updates, set all other sub-areas to null. The new CM will assign these
                        area = Area(county=county,)
                        agent.area = area
                    if sub_counties:
                        agent.area.sub_county = sub_counties
                    if locations:
                        agent.area.location = locations
                    if sub_locations:
                        agent.area.sub_location = sub_locations
                    if wards:
                        agent.area.ward = wards
                    if constituencies:
                        agent.area.constituency = constituencies
                    if districts:
                        agent.area.district = districts

                # creating new area
                if agent.area is None:
                    area = Area(
                        sub_county=sub_counties,
                        location=locations,
                        sub_location=sub_locations,
                        ward=wards, 
                        constituency=constituencies,
                        district=districts)
                    agent.area = area
                # save area
                agent.area.save()
                agent.save()

                return Response("Area successfuly assigned to agent",
                                status=status.HTTP_200_OK)
        
            #
            # Assign project to county
            #
            if project_id:
                county = data.get("county")
                region = data.get('region')
                if county:
                    county = county.pop()
                project = get_object_or_404(Project, pk=project_id)
                # Check if Project already had an area assigned to it, in this
                # case a new county will be assigned to it.
                if project.area:
                    project.area.county = county
                    project.area.region = region
                    project.county = county
                    project.region = region
                # Area being assigned for the first time - 
                # Create a new area instance and assign it
                if project.area is None:
                    area = Area(county=county, region=region)
                    project.area = area
                    project.county = county
                    project.region = region
                project.area.save()
                project.save()
               
                # Notify all CMs within this county that a project has been
                # assigned to the county
                project.send_notification_to_CM(sender=request.user, county=county)

                return Response("Area successfuly assigned to project",
                                status=status.HTTP_200_OK)
        except Exception as e:
            raise
