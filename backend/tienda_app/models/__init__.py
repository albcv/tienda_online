# Archivo: __init__.py
from .producto import Producto
from .compra import Compra
from .cliente import Cliente
from .categoria import Categoria
from .moneda import Moneda

__all__ = [
    'Producto',
    'Compra',
    'Cliente',
    'Categoria',
    'Moneda',
]