from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from ..models import Producto, Cliente
from ..serializers import ProductoSerializer, CompraSerializer

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def productos(request):
    # Obtener parámetros de consulta
    categoria_id = request.query_params.get('categoria_id')
    search = request.query_params.get('search', '').strip()
    limit = int(request.query_params.get('limit', 100))
    offset = int(request.query_params.get('offset', 0))

    queryset = Producto.objects.select_related('categoria', 'moneda').all()

    # Filtrar por categoría
    if categoria_id:
        queryset = queryset.filter(categoria_id=categoria_id)

    # Búsqueda por nombre (insensible a mayúsculas)
    if search:
        queryset = queryset.filter(nombre__icontains=search)

    # Paginación
    total = queryset.count()
    productos_page = queryset[offset:offset + limit]

    serializer = ProductoSerializer(productos_page, many=True)
    return Response({
        'total': total,
        'limit': limit,
        'offset': offset,
        'results': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def crear_compra(request):
    try:
        cliente = request.user.profile
    except Cliente.DoesNotExist:
        return Response({"error": "Usuario no tiene perfil de cliente"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    serializer = CompraSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(cliente=cliente)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # Depuración: imprime en consola del backend
    print("Errores del serializador:", serializer.errors)
    # Devuelve los errores detallados al frontend
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)