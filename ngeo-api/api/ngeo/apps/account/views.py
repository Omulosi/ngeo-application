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


# class Me(generics.RetrieveUpdateAPIView):
#     queryset = get_user_model().objects.all()
#     serializer_class = UserSerializer

#     def get_object(self):
#         return self.request.user


# class UserCreate(generics.CreateAPIView):
#     serializer_class = UserSerializer
#     permission_classes = (permissions.AllowAny, )

#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         token = Token.objects.create(user_id=response.data["pk"])
#         resp = {
#             "status": status.HTTP_201_CREATED,
#             "message": "User successfully registered!",
#             "token": token.key,
#             "user": response.data,
#         }
#         return Response(resp, status=status.HTTP_201_CREATED)


# class UserLogin(ObtainAuthToken):

#     serializer_class = CustomAuthTokenSerializer
#     permission_classes = (permissions.AllowAny, )

#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         status_code = status.HTTP_200_OK
#         resp = {
#             "status": status_code,
#             "message": "User successfully signed in!",
#             "user": response.data,
#         }
#         return Response(resp, status=status_code)
