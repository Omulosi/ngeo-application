from rest_framework import serializers
from ...models import FinanceOfficer

class FinanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = FinanceOfficer
        fields = '__all__'