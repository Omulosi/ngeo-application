"""
This module defines methods for sending emails
"""

from django.conf import settings

# from ngeo.apps.mail.models import Mail


# def send_reset_password_email(user, reset_token):
#     reset_url = settings.RESET_PASSWORD_URL.format(reset_token=reset_token,
#                                                    user_id=user.id)
#     Mail.send("ResetPassword", user, reset_url=reset_url)


# def send_welcome_email(user):
#     Mail.send("WelcomeUser", user)
