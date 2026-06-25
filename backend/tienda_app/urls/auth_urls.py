from django.urls import path
from ..views import auth_views

urlpatterns = [
    path('login/', auth_views.login, name='login'),
    path('register/', auth_views.register, name='register'),
    path('logout/', auth_views.logout, name='logout'),
    path('perfil/', auth_views.perfil_usuario, name='perfil'),
    path('cambiar-password/', auth_views.cambiar_password, name='cambiar_password'),

    path('health/', auth_views.health_check, name='health'),  
    path('keep-alive/', auth_views.keep_alive, name='keep-alive'),
]