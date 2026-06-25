from django.urls import include, path
from . import auth_urls, producto_urls


urlpatterns = [
    path('', include(auth_urls)),
    path('', include(producto_urls)),
   
]