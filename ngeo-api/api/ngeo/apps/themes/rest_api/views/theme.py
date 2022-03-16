from rest_framework import generics
from ...models import Theme
from ..serializers import ThemeSerializer

class ThemeList(generics.ListCreateAPIView):
    
    serializer_class = ThemeSerializer
    queryset = Theme.objects.all()


class ThemeDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ThemeSerializer
    queryset = Theme.objects.all()