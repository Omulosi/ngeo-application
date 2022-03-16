from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ngeo.apps.account.models import User
from ...models import FinanceOfficer
from ..serializers import FinanceSerializer


class FinanceOfficerList(generics.ListCreateAPIView):
    """
    API view to retrieve list of finance officers
    """
    serializer_class = FinanceSerializer
    queryset = FinanceOfficer.objects.all()


class FinanceOfficerDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one finance officer
    """
    serializer_class = FinanceSerializer
    queryset = FinanceOfficer.objects.all()

class Me(generics.RetrieveUpdateAPIView):
    """
    Retrieves currently logged in finance officer
    """

    serializer_class = FinanceSerializer

    def get_object(self):
        user = self.request.user
        finance_officer = get_object_or_404(FinanceOfficer, user=user)
        return finance_officer
