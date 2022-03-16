from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ngeo.apps.account.models import User
from ...models import CEOModel
from ..serializers import CEOSerializer


class CEOList(generics.ListCreateAPIView):
    """
    API view to retrieve list of CEOs
    """
    serializer_class = CEOModel
    queryset = CEOModel.objects.all()


class CEODetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one CEO
    """
    serializer_class = CEOModel
    queryset = CEOModel.objects.all()

class Me(generics.RetrieveUpdateAPIView):
    """
    Retrieves currently logged in CEO
    """

    serializer_class = CEOModel

    def get_object(self):
        user = self.request.user
        ceo = get_object_or_404(CEOModel, user=user)
        return ceo
