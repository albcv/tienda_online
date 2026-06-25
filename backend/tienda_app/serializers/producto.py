from rest_framework import serializers
from ..models import Producto, Categoria, Moneda, Compra

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class MonedaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moneda
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    moneda = MonedaSerializer(read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

class CompraSerializer(serializers.ModelSerializer):
    productos = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Producto.objects.all()
    )
    moneda = serializers.PrimaryKeyRelatedField(
        queryset=Moneda.objects.all()
    )

    class Meta:
        model = Compra
        fields = ['id', 'cliente', 'productos', 'total', 'moneda', 'fecha_compra']
        read_only_fields = ['id', 'cliente', 'fecha_compra']