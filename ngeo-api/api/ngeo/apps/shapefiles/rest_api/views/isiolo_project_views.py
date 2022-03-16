"""Isiolo Projects views."""

from rest_framework import generics
from ..serializers import IsioloProjectsSerializer
from ...models import IsioloProject
from .filters import ProjectFilter

class IsioloProjectList(generics.ListAPIView):
    """
    API view to retrieve list of projects
    """
    serializer_class = IsioloProjectsSerializer
    queryset = IsioloProject.objects.all()
    # filterset_fields = ('fname', 'theme', )
    filterset_class = ProjectFilter
    search_fields = ('fname', 'theme', )

class IsioloProjectDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one project
    """
    serializer_class = IsioloProjectsSerializer
    queryset = IsioloProject.objects.all()
