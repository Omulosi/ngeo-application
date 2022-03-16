from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ngeo.apps.account.models import User
from ...models import HumanResource
from ..serializers import HumanResourceSerializer


class HumanResourceList(generics.ListCreateAPIView):
    """
    API view to retrieve list of human resource
    """
    serializer_class = HumanResourceSerializer
    queryset = HumanResource.objects.all()


class HumanResourceDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one human resource
    """
    serializer_class = HumanResourceSerializer
    queryset = HumanResource.objects.all()

class Me(generics.RetrieveUpdateAPIView):
    """
    Retrieves currently logged in human resource
    """

    serializer_class = HumanResourceSerializer

    def get_object(self):
        user = self.request.user
        human_resource = get_object_or_404(HumanResource, user=user)
        return human_resource
