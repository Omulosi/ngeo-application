from django.apps import AppConfig


class AccountConfig(AppConfig):
    name = "ngeo.apps.account"
    
    def ready(self) -> None:
        from . import signals # noqa
