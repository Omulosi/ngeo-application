from django.urls import path
from .views import IncidentListCreate, IncidentDetail


urlpatterns = [
    path("incidents", IncidentListCreate.as_view(), name="incidents"),
    path("incidents/<pk>", IncidentDetail.as_view(), name="incident-detail"),
]
