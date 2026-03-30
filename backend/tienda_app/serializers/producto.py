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
    class Meta:
        model = Compra
        fields = ['id', 'usuario', 'productos', 'total', 'fecha_compra']
        read_only_fields = ['id', 'fecha_compra']