from django.urls import path
from .views import RegionalManagerList, RegionalManagerDetail, Me


urlpatterns = [
    path("regional_managers", RegionalManagerList.as_view(), name="regional_manager_list"),
    path("regional_managers/<int:pk>", RegionalManagerDetail.as_view(), name="regional_manager_detail"),
    path("regional_managers/me/", Me.as_view(), name="regional_manager_me"),
]
