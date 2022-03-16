from django.urls import path
from .views import CEODetail, CEOList, Me


urlpatterns = [
    path("ceos", CEOList.as_view(), name="ceo_list"),
    path("ceos/<int:pk>", CEODetail.as_view(), name="ceo_detail"),
    path("ceos/me/", Me.as_view(), name="ceo_me"),
]
