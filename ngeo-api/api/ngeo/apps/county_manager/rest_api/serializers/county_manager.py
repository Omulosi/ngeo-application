from rest_framework import serializers

# from ngeo.apps.common.serializers import AreaSerializer
from ngeo.apps.field_officer.rest_api.serializers import FieldOfficerSerializer
from ngeo.apps.projects.rest_api.serializers import ProjectSerializer
from ...models import CountyManager


class CountyManagerSerializer(serializers.ModelSerializer):
    field_officers = FieldOfficerSerializer(many=True, required=False)
    projects = ProjectSerializer(many=True, required=False)

    class Meta:
        model = CountyManager
        fields = "__all__"
        depth = 2
