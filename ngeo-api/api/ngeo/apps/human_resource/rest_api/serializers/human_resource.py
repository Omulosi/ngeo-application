from rest_framework import serializers
from ...models import HumanResource

class HumanResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = HumanResource
        fields = '__all__'