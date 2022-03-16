"""County view."""

from rest_framework import generics
from ...models import IsioloKeyInstallation
from ..serializers import IsioloKeyInstallationSerializer


class IsioloKeyInstallationList(generics.ListAPIView):
    """
    API view to retrieve list of key installations
    """
    serializer_class = IsioloKeyInstallationSerializer
    queryset = IsioloKeyInstallation.objects.all()


class IsioloKeyInstallationDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one key installation
    """
    serializer_class = IsioloKeyInstallationSerializer
    queryset = IsioloKeyInstallation.objects.all()
