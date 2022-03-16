from django.urls import path
from .views import Me, HumanResourceList, HumanResourceDetail


urlpatterns = [
    path("human_resources", HumanResourceList.as_view(), name="human_resources_list"),
    path("human_resources/<int:pk>", HumanResourceDetail.as_view(), name="human_resources_detail"),
    path("human_resources/me/", Me.as_view(), name="human_resources_me"),
]
