from rest_framework import serializers
from ngeo.apps.projects.rest_api.serializers import ProjectSerializer
from ...models import Theme


class ThemeSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, required=False)

    class Meta:
        model = Theme
        fields = "__all__"
        depth = 2