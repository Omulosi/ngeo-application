"""ngeo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/{{ docs_version }}/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path, include, re_path
from ngeo.apps.libs.exception_handler import not_found
import notifications.urls

handler500 = 'rest_framework.exceptions.server_error'
handler400 = 'rest_framework.exceptions.bad_request'
handler404 = not_found

# Custom admin values
admin.site.site_header = 'N-GEO Administration'
admin.site.index_title = 'All Modules'
# default: "Django site admin"
admin.site.site_title = 'N-GEO Site Admin' 
# Frontend URL
admin.site.site_url = settings.WEB_URL

urlpatterns = [
    path("admin/", admin.site.urls),
    # get list of users or single user
    re_path(r"api/v1/", include("ngeo.apps.account.urls")),
    # Auth endpoints from djoser
    # Login: /token/login/
    # Logout: /token/logout/
    # Register: /users/
    # Update password: /users/set_password
    # Reset password (send rest link to email): /users/reset_password/
    # Reset password confirm (Finish reset password process): /users/reset_password_confirm/
    path('api/v1/auth/', include('djoser.urls')),
    path('api/v1/auth/', include('djoser.urls.authtoken')),
    re_path(r'api/v1/inbox/notifications/', include(notifications.urls, namespace='notifications')),
    re_path(r"api/v1/", include("ngeo.apps.agents.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.projects.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.field_officer.rest_api.urls")),
    # re_path(r"api/v1/", include("ngeo.apps.shapefiles.rest_api.urls")),
    # re_path(r"api/v1/", include("ngeo.apps.incidence.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.county_manager.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.common.urls")),
    re_path(r"api/v1/", include("ngeo.apps.finance.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.human_resource.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.regional_manager.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.threat.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.themes.rest_api.urls")),
    re_path(r"api/v1/", include("ngeo.apps.ceo.rest_api.urls")),
]


# enable serve static by django for local development.
if settings.DEBUG:  # noqa
    from django.conf.urls.static import static

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# enable serve static by django for prod development.
if not settings.DEBUG:  # noqa
    from django.conf.urls.static import static

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


# enable debug_toolbar for local development (if installed)
if settings.DEBUG and "debug_toolbar" in settings.INSTALLED_APPS:
    import debug_toolbar

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]

