from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
import re

# Importamos el modelo Cliente (perfil de usuario con número de tarjeta)
from ..models import Cliente


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({"Error": "Contraseña no válida"}, status=status.HTTP_400_BAD_REQUEST)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def register(request):
    # Obtener campos
    email = request.data.get('email')
    numero_tarjeta = request.data.get('numero_tarjeta')
    telefono = request.data.get('telefono')
    direccion = request.data.get('direccion')

    # --- Validación de email ---
    if not email:
        return Response({"email": "El correo electrónico es obligatorio"},
                        status=status.HTTP_400_BAD_REQUEST)
   
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        return Response({"email": "El formato del correo electrónico no es válido"},
                        status=status.HTTP_400_BAD_REQUEST)

    # --- Validación de número de tarjeta ---
    if not numero_tarjeta:
        return Response({"numero_tarjeta": "El número de tarjeta es obligatorio"},
                        status=status.HTTP_400_BAD_REQUEST)
    if not re.match(r'^\d{16}$', numero_tarjeta):
        return Response({"numero_tarjeta": "El número de tarjeta debe tener 16 dígitos"},
                        status=status.HTTP_400_BAD_REQUEST)

    # --- Validación de teléfono ---
    if not telefono:
        return Response({"telefono": "El teléfono es obligatorio"},
                        status=status.HTTP_400_BAD_REQUEST)
    telefono_limpio = re.sub(r'[\s\-]', '', telefono)
    if not telefono_limpio.isdigit():
        return Response({"telefono": "El teléfono debe contener solo dígitos"},
                        status=status.HTTP_400_BAD_REQUEST)
    if len(telefono_limpio) < 7 or len(telefono_limpio) > 15:
        return Response({"telefono": "El teléfono debe tener entre 7 y 15 dígitos"},
                        status=status.HTTP_400_BAD_REQUEST)

    # --- Validación de dirección ---
    if not direccion or not direccion.strip():
        return Response({"direccion": "La dirección es obligatoria"},
                        status=status.HTTP_400_BAD_REQUEST)
    if len(direccion.strip()) < 5:
        return Response({"direccion": "La dirección debe tener al menos 5 caracteres"},
                        status=status.HTTP_400_BAD_REQUEST)

    # --- Creación de usuario ---
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()

        # Crear perfil Cliente
        Cliente.objects.create(
            user=user,
            numero_tarjeta=numero_tarjeta,
            telefono=telefono_limpio,
            direccion=direccion.strip()
        )

        token = Token.objects.create(user=user)
        user_data = UserSerializer(user).data
        return Response({'token': token.key, 'user': user_data},
                        status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({"message": "Sesión cerrada correctamente"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def perfil_usuario(request):
    user = request.user
    data = {
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined.strftime('%Y-%m-%d'),
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({"error": "Faltan campos"}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({"error": "Contraseña actual incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 6:
        return Response({"error": "La nueva contraseña debe tener al menos 6 caracteres"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Contraseña cambiada correctamente"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([])  
@permission_classes([])     
def health_check(request):
    return Response({"status": "ok"}, status=200)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def keep_alive(request):
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1;")
        cursor.fetchone()
    return Response({"status": "ok", "db": "alive"}, status=200)