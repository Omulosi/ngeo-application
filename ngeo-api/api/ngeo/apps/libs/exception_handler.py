from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.exceptions import NotFound

def not_found(request, exception):
    return Response(
        {"data": str(exception)},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


def exception_handler(exc, context):
    """
    Handle Django ValidationError as an accepted exception
    Must be set in settings:
    >>> REST_FRAMEWORK = {
    ...     # ...
    ...     'EXCEPTION_HANDLER': 'libs.exception_handler.exception_handler',
    ...     # ...
    ... }
    For the parameters, see ``exception_handler``
    """

    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, 'message_dict'):
            exc = DRFValidationError(detail=exc.message_dict)
        else:
            exc = DRFValidationError(detail=exc.message)

    return drf_exception_handler(exc, context)

def custom_exception_handler(exc, context):
    """
    Call REST framework's default exception handler first, to get the
    standard exception.

    Must be set in settings:
    >>> REST_FRAMEWORK = {
    ...     # ...
    ...     'EXCEPTION_HANDLER': 'libs.exception_handler.custom_exception_handler',
    ...     # ...
    ... }
    For the parameters, see ``exception_handler``
    """
    response = exception_handler(exc, context)

    if response is not None:
        response.data['status_code'] = response.status_code
        

    return response



def unknown_exception_handler(exception):
    return Response(
        {"data": str(exception)},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
