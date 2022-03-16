from django.contrib import admin
from .models import CEOModel


@admin.register(CEOModel)
class CEOAdmin(admin.ModelAdmin):
    verbose_name_plural = 'CEOs'

