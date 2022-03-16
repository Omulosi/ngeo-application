from django.urls import path
from .views import FinanceOfficerList, FinanceOfficerDetail, Me


urlpatterns = [
    path("finance_officers", FinanceOfficerList.as_view(), name="finance_officer_list"),
    path("finance_officers/<int:pk>", FinanceOfficerDetail.as_view(), name="finance_officer_detail"),
    path("finance_officers/me/", Me.as_view(), name="finance_officer_me"),
]
