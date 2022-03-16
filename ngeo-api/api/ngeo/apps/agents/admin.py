from django.contrib import admin
from .models import Agent, AgentReturn


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    pass


# @admin.register(AgentReturn)
# class AgentReturnAdmin(admin.ModelAdmin):
#     pass