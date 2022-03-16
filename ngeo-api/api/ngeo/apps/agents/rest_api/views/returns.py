from rest_framework import generics
from ngeo.apps.agents.models import AgentReturn, Agent
from ngeo.apps.projects.models import Project
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..serializers import AgentReturnSerializer
from ngeo.apps.account.models import User

class AgentReturnListCreate(generics.ListCreateAPIView):
    """
    API view to retrieve list of returns
    """
    serializer_class = AgentReturnSerializer
    queryset = AgentReturn.objects.all()

    def post(self, request):
        try:
            agent_pk = request.data.get('agent')
            project_pk = request.data.get('project')

            agent = get_object_or_404(Agent, pk=agent_pk)
            project = get_object_or_404(Project, pk=project_pk)
            data = request.data
            data['agent'] = agent
            data['project'] = project
        
            agentReturn = AgentReturn(**data)
            agentReturn.save()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CreateReturn(generics.CreateAPIView):

    serializer_class = AgentReturnSerializer
    queryset = AgentReturn.objects.all()

class AgentReturnDetail(generics.RetrieveDestroyAPIView):
    """
    API view to retrieve one agent
    """
    def get_queryset(self):
        queryset = AgentReturn.objects.filter(agent_id=self.kwargs["pk"]).filter(id=self.kwargs["return_pk"])
        return queryset

    serializer_class = AgentReturnSerializer

class ReturnDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve one return
    """
    queryset = AgentReturn.objects.all()
    serializer_class = AgentReturnSerializer

class MyReturnList(APIView):
    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        returns = AgentReturn.objects.filter(agent__field_officer__user=user)
        data = AgentReturnSerializer(returns, many=True).data
        return Response(data)