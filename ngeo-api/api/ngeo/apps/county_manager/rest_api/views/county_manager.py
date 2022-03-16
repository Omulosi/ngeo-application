from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from ngeo.apps.account.models import User
from ngeo.apps.regional_manager.models import RegionalManager
from ...models import CountyManager
from ..serializers import CountyManagerSerializer

#  return self.queryset.filter(Q(area__county=county_manager.area.county) & Q(user__role=User.FOO))
#         return self.queryset.filter(user__role=User.FOO)

class CountyManagerList(generics.ListAPIView):
    """
    Returns a list of county managers for a 
    given user.
    Returns all county managers if the user has role HR.
    """

    serializer_class = CountyManagerSerializer
    queryset = CountyManager.objects.all()

    def get_queryset(self):
        # Return all county managers if user has HR role
        # Return user specific county manager list for RMs
        user = self.request.user;
        # if user.role == User.HR or user.role == User.FINANCE:
        #     return self.queryset.filter(user__role=User.CM)

        # import pdb;pdb.set_trace()
        # All CMs in this region
        if user.role == User.RM:
            region_manager = get_object_or_404(RegionalManager, user=user)
            region = region_manager.area.region
            # import pdb;pdb.set_trace()
            if region:
                return self.queryset.filter(Q(area__region=region) & Q(user__role=User.CM))
            return self.queryset.filter(Q(regional_manager=region_manager) & Q(user__role=User.CM))
        # return self.queryset.filter(user__role=User.CM)
        # import pdb;pdb.set_trace()
        return self.queryset


class CountyManagerDetail(generics.RetrieveDestroyAPIView):
    """
    Returns one county manager
    """

    serializer_class = CountyManagerSerializer
    queryset = CountyManager.objects.all()


class Me(generics.RetrieveUpdateAPIView):
    """
    Retrieves currently logged in county manager
    """

    serializer_class = CountyManagerSerializer

    def get_object(self):
        user = self.request.user
        county_manager = get_object_or_404(CountyManager, user=user)
        return county_manager


# class Me(APIView):
#     """
#     get county manager
#     """
#     def get(self, request):
#         import pdb; pdb.set_trace()
#         return Response(
#                     "Me county manager",
#                     status=status.HTTP_200_OK)
