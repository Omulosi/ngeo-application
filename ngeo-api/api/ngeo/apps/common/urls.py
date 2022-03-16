from django.urls import path

from .views import AreaDetail, AreaListCreate, MyAreaList, MyNotificationList, NotificationDetail, AssignArea

urlpatterns = [
    path("areas", AreaListCreate.as_view(), name="area_list"),
    path("areas/assign", AssignArea.as_view(), name="area_assign"),
    path("areas/<int:pk>", AreaDetail.as_view(), name="area_detail"),
    path("users/<pk>/areas", MyAreaList.as_view(), name="my_area_list"),
    path("user/notifications/",
         MyNotificationList.as_view(),
         name="notifications"),
    path("user/notifications/<pk>",
         NotificationDetail.as_view(),
         name="notification-detail"),
]
