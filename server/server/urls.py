"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from myapp.views import create_user
from myapp.views import recognize_user
from myapp.views import admin_login


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/admin/login/', admin_login, name='admin-login'),
    path('api/create_user/', create_user, name='create_user'),
    path('api/recognize_user/', recognize_user, name='recognize_user'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)