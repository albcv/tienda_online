from django.urls import path
from ..views import productos_views

urlpatterns = [
    path('productos/', productos_views.productos, name='productos'),
    path('compras/', productos_views.crear_compra, name='productos'),
    
]