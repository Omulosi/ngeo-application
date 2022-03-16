from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ngeo.apps.account.models import User
from ...models import RegionalManager
from ..serializers import RegionalManagerSerializer


class RegionalManagerList(generics.ListCreateAPIView):
    """
    API view to retrieve list of regional managers
    """
    serializer_class = RegionalManagerSerializer
    queryset = RegionalManager.objects.all()

    def get_queryset(self):
        # Return all regional managers if user has HR role
        # otherwise return user specific region manager list
        # if self.request.user.role == User.HR:
        #     return self.queryset
        # return self.queryset.filter(user=self.request.user)
        user = self.request.user;
        if user.role == User.HR or user.role == User.FINANCE or  user.role == User.CEO:
            return self.queryset
        return self.queryset.filter(user=self.request.user)


class RegionalManagerDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one regional managers
    """
    serializer_class = RegionalManagerSerializer
    queryset = RegionalManager.objects.all()

class Me(generics.RetrieveUpdateAPIView):
    """
    Retrieves currently logged in regional managers
    """

    serializer_class = RegionalManagerSerializer

    def get_object(self):
        user = self.request.user
        regional_manager = get_object_or_404(RegionalManager, user=user)
        return regional_manager
