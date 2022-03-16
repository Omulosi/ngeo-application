from django.urls import path, re_path
# from .views import (
#     CountyList,
#     CountyDetail,
#     SubLocationList, 
#     SubLocationName, 
#     IsioloProjectDetail, 
#     IsioloProjectList,
#     IsioloKeyInstallationDetail,
#     IsioloKeyInstallationList,
#     ConstituencyList,
#     ConstituencyDetail,
#     OfficeList,
#     RegionList,
#     RegionDetail,
#     KenyaHealthDetail,
#     KenyaHealthList,
#     KenyaSubcountyDetail,
#     KenyaSubcountyList
# )

# urlpatterns = [
#     path("counties", CountyList.as_view(), name="county_list"),
#     path("counties/<int:pk>", CountyDetail.as_view(), name="county_detail"),
#     path("sublocations", SubLocationList.as_view(), name="sublocation_list"),
#     re_path("^sublocations/name/(?P<sublocation_name>.+)/$", SubLocationName.as_view(), name="sublocation_name"),
#     path("isiolo_projects", IsioloProjectList.as_view(), name="isiolo_project_list"),
#     path("isiolo_projects/<int:pk>", IsioloProjectDetail.as_view(), name="isiolo_project_detail"),
#     path("isiolo_key_installations", IsioloKeyInstallationList.as_view(), name="isiolo_key_installations_list"),
#     path("constituencies", ConstituencyList.as_view(), name="constituency_list"),
#     path("constituencies/<int:pk>", ConstituencyDetail.as_view(), name="constituency_list"),
#     path("offices", OfficeList.as_view(), name="office_list"),
#     path("regions", RegionList.as_view(), name="region_list"),
#     path("regions/<int:pk>", RegionDetail.as_view(), name="region-detail"),
#     path("kenya_health_centers", KenyaHealthList.as_view(), name="health-center-list"),
#     path("kenya_health_centers/<int:pk>", KenyaHealthDetail.as_view(), name="health-center-detail"),
#     path("kenya_subcounties", KenyaSubcountyList.as_view(), name="sub-county-list"),
#     path("kenya_subcounties/<int:pk>", KenyaSubcountyDetail.as_view(), name="sub-county-detail"),
# ]
