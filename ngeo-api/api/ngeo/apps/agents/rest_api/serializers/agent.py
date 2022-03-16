
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from ...models import Agent, AgentReturn
from ngeo.apps.projects.models import Project
from ngeo.apps.projects.rest_api.serializers import ProjectSerializer
# from ngeo.apps.common.serializers import AreaSerializer

class AgentReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentReturn
        fields = '__all__'
        depth = 2

    # def create(self, validated_data):
    #     agent_pk = validated_data.get('agent')
    #     project_pk = validated_data.get('project')
    #     import pdb; pdb.set_trace()
    #     agent = get_object_or_404(Agent, pk=agent_pk)
    #     project = get_object_or_404(Project, pk=project_pk)
      
    #     agentReturn = AgentReturn(**validated_data)
    #     agentReturn.save()
    #     import pdb; pdb.set_trace()
    #     return agentReturn;

class AgentSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, required=False, read_only=True)
    returns = AgentReturnSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Agent
        depth = 2
        fields = '__all__'