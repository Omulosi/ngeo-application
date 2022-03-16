from django.urls import path
from .views import ThreatListCreate, ThreatDetail, DeleteThreat


urlpatterns = [
    path("threats", ThreatListCreate.as_view(), name="threat-list"),
    path("threats/<pk>", ThreatDetail.as_view(), name="threat-detail"),
    path("threats/<pk>/delete", DeleteThreat.as_view(), name="threat-delete"),
]
