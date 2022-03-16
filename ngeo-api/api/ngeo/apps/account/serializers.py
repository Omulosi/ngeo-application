from django.contrib.auth import get_user_model, authenticate
from django.db.utils import IntegrityError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.tokens import default_token_generator
from rest_framework import serializers
from rest_framework.exceptions import ParseError
from django.contrib.auth.models import update_last_login
from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.regional_manager.models import RegionalManager
from ngeo.apps.finance.models import FinanceOfficer
from ngeo.apps.human_resource.models import HumanResource
from ngeo.apps.ceo.models import CEOModel
from ngeo.apps.common.serializers import AreaSerializer
# from .mail import send_welcome_email, send_reset_password_email
from .models import User


class UserSerializer(serializers.ModelSerializer):
    is_staff = serializers.SerializerMethodField(read_only=True)
    area = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}
        depth = 2

    def get_area(self, obj):
        try:
            area = None
            if obj.role == User.RM:
                regional_manager = RegionalManager.objects.filter(user=obj).get()
                area = AreaSerializer(regional_manager.area).data
            if obj.role == User.CM:
                county_manager = CountyManager.objects.filter(user=obj).get()
                area = AreaSerializer(county_manager.area).data
            if obj.role == User.FOO:
                field_officer = FieldOfficer.objects.filter(user=obj).get()
                area = AreaSerializer(field_officer.area).data
            return area
        except:
            return None

    def get_is_staff(self, obj):
        return obj.is_staff

    def validate_email(self, value):
        norm_email = value.lower()
        if get_user_model().objects.filter(email=norm_email).exists():
            raise serializers.ValidationError(
                "user with this email address already exists.")
        return norm_email

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        user.send_notification_to_HR()
        return user

    def update(self, obj, validated_data):
        password = validated_data.pop("password", None)
        if password:
            obj.set_password(password)
        role = validated_data.get("role")

        if role is not None:
            try:
                # Delete all profiles related this user
                CEOModel.objects.filter(user=obj).delete()
                HumanResource.objects.filter(user=obj).delete()
                FinanceOfficer.objects.filter(user=obj).delete()
                RegionalManager.objects.filter(user=obj).delete()
                CountyManager.objects.filter(user=obj).delete()
                FieldOfficer.objects.filter(user=obj).delete()

                # Create new user profile for this role
                if role == User.CEO:
                    ceo = CEOModel.objects.create(user=obj)
                    
                if role == User.HR:
                    human_resource = HumanResource.objects.create(user=obj)
                  
                if role == User.FINANCE:
                    finance = FinanceOfficer.objects.create(user=obj)
                 
                if role == User.RM:
                    regional_manager = RegionalManager.objects.create(user=obj)
                  
                if role == User.CM:
                    county_manager = CountyManager.objects.create(user=obj)
                   
                if role == User.FOO:
                    field_officer = FieldOfficer.objects.create(user=obj)
                   
                obj.role = role
            except IntegrityError as e:
                # User already has this role, no need to reassign
                pass
        return super().update(obj, validated_data)


class CustomAuthTokenSerializer(serializers.Serializer):
    """
    Modified from rest_framework.authtoken.serializers.AuthTokenSerializer
    to accept email field instead of username
    """

    email = serializers.CharField(label=_("Email"))
    password = serializers.CharField(label=_("Password"),
                                     style={"input_type": "password"},
                                     trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(request=self.context.get("request"),
                                email=email.lower(),
                                password=password)

            # The authenticate call simply returns None for is_active=False
            # users. (Assuming the default ModelBackend authentication
            # backend.)

            if not user:
                msg = _("Invalid email or password")
                raise serializers.ValidationError(msg, code="authorization")
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code="authorization")

        attrs["user"] = user
        return attrs


# class ForgotPasswordSerializer(serializers.Serializer):
#     email = serializers.EmailField(write_only=True)

#     def create(self, validated_data):
#         email = validated_data["email"].lower()
#         try:
#             user = get_user_model().objects.get(email=email)
#         except get_user_model().DoesNotExist:
#             return {}

#         reset_token = default_token_generator.make_token(user)
#         send_reset_password_email(user, reset_token=reset_token)

#         return {}


# class ResetPasswordSerializer(serializers.Serializer):
#     token = serializers.CharField(write_only=True)
#     user_id = serializers.IntegerField(write_only=True)
#     password = serializers.CharField(write_only=True)

#     def create(self, validated_data):
#         token = validated_data["token"]
#         user_id = validated_data["user_id"]
#         password = validated_data["password"]

#         user = get_user_model().objects.get(id=user_id)
#         if not default_token_generator.check_token(user, token):
#             raise ParseError(detail="Invalid token")

#         user.set_password(password)
#         user.save()
#         return {}
