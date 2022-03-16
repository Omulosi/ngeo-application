from django.urls import path

from .views import (
    AgentDetail,
    AgentListCreate,
    FieldOfficerAgentList,
    DeleteAgent,
#     AgentReturnListCreate,
#     ReturnDetail,
#     MyReturnList,
    UpdateAgentTerms,
)

urlpatterns = [
    # Agents
    path("agents", AgentListCreate.as_view(), name="agent-list"),
    path("agents/<pk>", AgentDetail.as_view(), name="agent-detail"),
    path("agents/<pk>/delete", DeleteAgent.as_view(), name="agent-detail"),
    path("field_officer/agents",
         FieldOfficerAgentList.as_view(),
         name="field-officer-agent-list"),
    # update terms and send notifications
    path("agents/<pk>/update_terms",
         UpdateAgentTerms.as_view(),
         name="agent-update-terms"),
    # Returns
#     path("returns", AgentReturnListCreate.as_view(), name="return-list"),
#     path("returns/<int:pk>", ReturnDetail.as_view(), name="return-detail"),
#     path("users/<pk>/returns", MyReturnList.as_view(),
#          name="user_return_list"),
]
