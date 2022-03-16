from django.urls import path
from .views import ThemeDetail, ThemeList


urlpatterns = [
    path("themes", ThemeList.as_view(), name="theme-list"),
    path("themes/<int:pk>", ThemeDetail.as_view(), name="theme-detail"),
]
