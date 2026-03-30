from django.contrib import admin
from .ProductoAdmin import ProductoAdmin
from ..models import Producto, Categoria, Compra, Cliente, Moneda

admin.site.register(Producto, ProductoAdmin)
admin.site.register(Categoria)
admin.site.register(Compra)
admin.site.register(Cliente)
admin.site.register(Moneda)