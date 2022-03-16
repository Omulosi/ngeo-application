from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from django.shortcuts import get_object_or_404
from django.contrib.gis.geos import fromstr

from ...models import Project
from ngeo.apps.account.models import User
from ngeo.apps.agents.models import Agent
from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.regional_manager.models import RegionalManager
from ngeo.apps.themes.models import Theme
from ngeo.apps.common.models import Area
from ..serializers import ProjectSerializer, ProjectDetailSerializer

import pandas as pd
from io import StringIO
from django.contrib.gis.geos import fromstr
import csv
import logging

logger = logging.getLogger(__name__)


# projects
class ProjectList(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        # Return projects matching this users area
        user = self.request.user
        if user.role == User.HR or user.role == User.CEO:
            return self.queryset

        if user.role == User.RM:
            regional_manager = get_object_or_404(RegionalManager, user=user)
            # Return all FOOs within this county
            # import pdb; pdb.set_trace()
            return self.queryset.filter(area__region=regional_manager.area.region)
        if user.role == User.CM:
            county_manager = get_object_or_404(CountyManager, user=user)
            # Return all FOOs within this county
            # import pdb; pdb.set_trace()
            return self.queryset.filter(area__county=county_manager.area.county)

        if user.role == User.FOO:
            field_officer = get_object_or_404(FieldOfficer, user=user)
            # region, county = field_officer.area.region, field_officer.area.county
            # Return all projects of this FOO
            # import pdb; pdb.set_trace()
            return self.queryset.filter(field_officer=field_officer)
        
        return self.queryset

    def create(self, request, *args, **kwargs):
        try:
            user = request.user
            data = request.data
            longitude = data.get("longitude")
            latitude = data.get("latitude")
            theme_id = data.get('theme')
            project_name = data.get('name')
            data['name'] = project_name.strip()
            if longitude and latitude:
                location = fromstr(f"POINT({longitude} {latitude})", srid=4326)
                data["location"] = location
            if theme_id:
                theme = get_object_or_404(Theme, pk=theme_id)
                data["theme"] = theme
            project = Project.objects.create(**data)
            project.activate()

            logger.critical( f"Project {project.name} successfully added by the User {user.first_name} {user.last_name} (Staff No: {user.staff_number})")
        
            return Response({"message": "Project successfuly added!"},
                            status=status.HTTP_201_CREATED)
        except:
            raise


class AssignedProjectsList(APIView):
    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        projects = []
        if user.role == User.FOO:
            projects = Project.objects.filter(field_officer__user=user)
        if user.role == User.CM:
            projects = Project.objects.filter(county_manager__user=user)

        data = ProjectSerializer(projects, many=True).data
        return Response(data)

class UnAssignProject(APIView):
    def patch(self, request, pk):
        assignee = request.data.get('assignee')
        project = get_object_or_404(Project, pk=pk)
        if assignee == 'FOO':
            # Set field officer to null
            project.field_officer = None
            project.save()
            return Response({"message": "Project successfuly unassigned!"},
                            status=status.HTTP_200_OK)
        if assignee == 'Agent':
            # Set agent to null
            project.agent = None
            project.save()
            return Response({"message": "Project successfuly unassigned!"},
                            status=status.HTTP_200_OK)
        



class ProjectDetail(generics.RetrieveUpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer

    def patch(self, request, pk):
        field_officer_id = request.data.get('field_officer')
        agent_id = request.data.get('agent')
        project = self.get_object() # current project
        theme_id = request.data.get('theme')
        user = request.user


        if theme_id:
            theme = get_object_or_404(Theme, pk=theme_id)
            request.data['theme'] = theme
            project = self.queryset.filter(pk=pk).update(**request.data)
            logger.critical( f"The Theme {theme} successfully assigned to the Project {project.name}  by the User {user.first_name} {user.last_name} (Staff No: {user.staff_number})")
            return Response({"message": "Project successfuly assigned!"},
                            status=status.HTTP_200_OK)

        if field_officer_id:
            field_officer = get_object_or_404(FieldOfficer, pk=field_officer_id)
            project.field_officer = field_officer
            project.save()
            logger.critical( f"The Project {project.name} successfully assigned to the Field Officer {field_officer.user.first_name} {field_officer.user.last_name} by the User {user.first_name} {user.last_name} (Staff No: {user.staff_number})")
            return Response({"message": "Project successfuly assigned!"},
                            status=status.HTTP_200_OK)
        if agent_id:
            agent = get_object_or_404(Agent, pk=agent_id)
            project.agent.add(agent)
            project.save()
            logger.critical( f"The Project {project.name} successfully assigned to the Agent {agent.first_name} {agent.last_name} by the User {user.first_name} {user.last_name} (Staff No: {user.staff_number})")
            return Response({"message": "Project successfuly assigned!"},
                            status=status.HTTP_200_OK)
        return super().patch(request, pk)

class DeleteProject(APIView):
    def patch(self, request, pk):
        user = self.request.user
        reason = request.data.get('delete_reason')
        project = get_object_or_404(Project, pk=pk)
        project.delete_reason = reason
        project.deleted_by = user
        project.save()
        project.delete()
        logger.critical( f"The Project {project.name} successfully discontinued by the User {user.first_name} {user.last_name} (Staff No: {user.staff_number})")
        return Response({"message": "Project successfuly deleted!"},
                            status=status.HTTP_200_OK)

class AgentProjectList(generics.ListAPIView):
    def get_queryset(self):
        queryset = Project.objects.filter(agent_id=self.kwargs["pk"])
        return queryset

    serializer_class = ProjectSerializer


class AgentProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        queryset = Project.objects.filter(agent_id=self.kwargs["pk"]).filter(
            id=self.kwargs["project_pk"])
        return queryset

    serializer_class = ProjectSerializer


class AssignAgentProject(APIView):
    serializer_class = ProjectSerializer

    def patch(self, request, pk, project_pk):
        data = request.data
        data["agent"] = pk
        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            project = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FieldOfficerProjectList(generics.ListAPIView):
    def get_queryset(self):
        queryset = Project.objects.filter(field_officer_id=self.kwargs["pk"])
        return queryset

    serializer_class = ProjectSerializer


class FieldOfficerProjectDetail(generics.RetrieveDestroyAPIView):
    def get_queryset(self):
        queryset = Project.objects.filter(field_officer_id=self.kwargs["pk"])
        return queryset

    serializer_class = ProjectSerializer


class CountyManagerProjectList(generics.ListAPIView):
    def get_queryset(self):
        queryset = Project.objects.filter(county_manager_id=self.kwargs["pk"])
        return queryset

    serializer_class = ProjectSerializer


class CountyManagerProjectDetail(generics.RetrieveDestroyAPIView):
    def get_queryset(self):
        queryset = Project.objects.filter(county_manager_id=self.kwargs["pk"])
        return queryset

    serializer_class = ProjectSerializer

#

class UploadProjects(APIView):
    parser_classes = [MultiPartParser]


    def post(self, request):
        user = request.user
       
        try:
            file = request.data['file']
            # project_file = options['file_path']
            df = pd.read_excel(file)
           
            # # Convert data to csv for ease of reading
            project_data = csv.DictReader(StringIO(df.to_csv()))
           
            project_list = []
            for row in project_data:
                data = {}
                project_name = row['NAME']
                project = self.get_project(project_name)
                # Skip if project already exists
                if project is not None:
                    print(f'The Project {project_name} already exists, skipping...')
                    continue
                data['name'] = project_name
                latitude = row['Latitude']
                longitude = row['Longitude']
                theme_name = row['THEME']
                theme = self.get_theme(theme_name)
                # Skip if theme is not among currently available themes
                if theme is None:
                    continue
                data['theme'] = theme
                data['initiated_by'] = row['CONTROL']
                data['latitude'] = latitude
                data['longitude'] = longitude
                county = row['COUNTY']
                region = row['REGION']
                data['county'] = county
                data['region'] = region
                if county and region:
                    area = Area.objects.create(county=county, region=region)
                    data['area'] = area
                if longitude and latitude:
                    location = fromstr(f"POINT({longitude} {latitude})", srid=4326)
                    data["location"] = location
                project_list.append(Project(**data))
            Project.objects.bulk_create(list(project_list))

            logger.critical( f"Projects (Total: {len(project_list)}) successfully added from an Excel file  by the User {user.first_name} {user.last_name} (Staff No: {user.staff_number})")
            return Response({"message": "Projects successfully added to the DB!"},
                            status=status.HTTP_200_OK)

                
        except Exception as e:
            print('Error loading projects: ', e)

    @staticmethod
    def get_theme(theme_name):
        try:
            theme_name = theme_name.strip()
            theme = Theme.objects.get(name__iexact=theme_name)
            return theme
        except Theme.DoesNotExist:
            print(f'The theme {theme_name} does not exist, skipping...')
            return None
        except Exception as e:
            print('Error getting theme, skipping...: ', e)
            return None

    @staticmethod
    def get_project(project_name):
        try:
            project_name = project_name.strip()
            project = Project.objects.get(name__iexact=project_name)
            return project
        except Project.DoesNotExist:
            return None
        except Exception as e:
            return None
