import rest_framework_filters as django_filters
from django.db.models import Q
from ...models import SubLocation, IsioloProject, County, CountyGazetted


class BaseFilter(django_filters.FilterSet):
    def OR(self, queryset, field_name, value):
        if not hasattr(self, 'groups'):
            setattr(self, 'groups', {})
        self.groups[field_name] = value
        return queryset

    @property
    def qs(self):
        base_queryset = super().qs
        if not hasattr(self, "groups"):
            return base_queryset

        query = Q()
        for key, value in self.groups.items():
            query |= Q(**{key: value})
        return base_queryset.filter(query)

class SublocationFilter(django_filters.FilterSet):
    locname = django_filters.CharFilter(lookup_expr='iexact')
    sub_name = django_filters.CharFilter(lookup_expr='iexact')
    divname = django_filters.CharFilter(lookup_expr='iexact')
    distname = django_filters.CharFilter(lookup_expr='iexact')
    provname = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = SubLocation
        fields = {
            'locname': ['iexact', ],
            'sub_name': ['iexact', ],
            'divname': ['iexact', ],
            'distname': ['iexact', ],
            'provname': ['iexact', ], 
        }


class SublocationORFilter(BaseFilter):
    locname = django_filters.CharFilter(lookup_expr='iexact')
    sub_name = django_filters.CharFilter(lookup_expr='iexact')
    divname = django_filters.CharFilter(lookup_expr='iexact')
    distname = django_filters.CharFilter(lookup_expr='iexact')
    provname = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = SubLocation
        fields = {
            'locname': ['iexact', ],
            'sub_name': ['iexact', ],
            
        }

class ProjectFilter(django_filters.FilterSet):
    theme = django_filters.CharFilter(lookup_expr='iexact')
    fname = django_filters.CharFilter(lookup_expr='iexact')
    id = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = IsioloProject
        fields = ['fname', 'theme']


class CountyFilter(django_filters.FilterSet):
    counties = django_filters.CharFilter(lookup_expr='iexact')
    class Meta:
        model = CountyGazetted
        fields = ['counties', ]