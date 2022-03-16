from django.urls import path
from .views import CountyManagerList, CountyManagerDetail, Me


urlpatterns = [
    path("county_managers", CountyManagerList.as_view(), name="county_manager_list"),
    path("county_managers/<pk>", CountyManagerDetail.as_view(), name="county_manager_detail"),
    path("county_managers/me/", Me.as_view(), name="county-manager-me"),
]
