from rest_framework import serializers
from ...models import CEOModel

class CEOSerializer(serializers.ModelSerializer):

    class Meta:
        model = CEOModel
        fields = '__all__'