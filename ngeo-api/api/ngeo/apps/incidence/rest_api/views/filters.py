import django_filters
from ...models import Incident


class IncidentFilter(django_filters.FilterSet):
    id = django_filters.CharFilter(lookup_expr="iexact")

    class Meta:
        model = Incident
        fields = ["name"]
