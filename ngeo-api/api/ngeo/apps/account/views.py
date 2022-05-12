from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
import logging
from .models import User

from .serializers import (
    UserSerializer,
)

logger = logging.getLogger(__name__)

class UserList(generics.ListAPIView):
    queryset = get_user_model().objects.not_deleted()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = get_user_model().objects.not_deleted()
    serializer_class = UserSerializer

