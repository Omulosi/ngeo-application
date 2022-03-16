
from rest_framework import serializers
from ...models import FieldOfficer
from ngeo.apps.agents.rest_api.serializers import AgentSerializer
from ngeo.apps.common.serializers import AreaSerializer
from ngeo.apps.projects.rest_api.serializers import ProjectSerializer


class FieldOfficerSerializer(serializers.ModelSerializer):
    agents = AgentSerializer(many=True, required=False)
    projects = ProjectSerializer(many=True, required=False)
    
    class Meta:
        model = FieldOfficer
        fields = '__all__'
        depth = 2