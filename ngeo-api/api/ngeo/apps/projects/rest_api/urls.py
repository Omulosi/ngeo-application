from django.urls import path
from .views import (
    ProjectList,
    ProjectDetail,
    UnAssignProject,
    UploadProjects,
    DeleteProject,
    # AgentProjectDetail,
    # AgentProjectList,
    # FieldOfficerProjectDetail,
    # FieldOfficerProjectList,
    # CountyManagerProjectDetail,
    # CountyManagerProjectList,
    # AssignedProjectsList
)


urlpatterns = [
    path("projects", ProjectList.as_view(), name="project-list"),
    path("projects/<int:pk>", ProjectDetail.as_view(), name="project-detail"),
    path("projects/<int:pk>/unassign", UnAssignProject.as_view(), name="project-unassign"),
    path("projects/<int:pk>/delete", DeleteProject.as_view(), name="project-delete"),
    path("projects/upload", UploadProjects.as_view(), name="project-upload"),
    #
    #
    # path("agents/<int:pk>/projects", AgentProjectList.as_view(), name="agent_project_list"),
    # path("agents/<int:pk>/projects/<int:project_pk>", AgentProjectDetail.as_view(), name="agent_project_detail"),
    # # field officer projects
    # path("field_officers/<pk>/projects", FieldOfficerProjectList.as_view(), name="foo-projects"),
    # path("field_officers/<int:pk>/projects/<int:project_pk>", FieldOfficerProjectDetail.as_view(), name="foo-project"),
    # # county manager projects
    # path("county_managers/<int:pk>/projects", CountyManagerProjectList.as_view(), name="cm-projects"),
    # path("county_managers/<int:pk>/projects/<int:project_pk>", CountyManagerProjectDetail.as_view(), name="cm-project"),
]
