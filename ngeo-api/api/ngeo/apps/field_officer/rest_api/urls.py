from django.urls import path
from .views import FieldOfficerList, FieldOfficerDetail, Me


urlpatterns = [
    path("field_officers", FieldOfficerList.as_view(), name="field_officer_list"),
    path("field_officers/<int:pk>", FieldOfficerDetail.as_view(), name="field_officer_detail"),
    path("field_officers/me/", Me.as_view(), name="field-officer-current"),
]
