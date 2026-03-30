from django.contrib import admin
from django.utils.html import format_html
from .models import Producto, Categoria, Compra, Cliente, Moneda

class ProductoAdmin(admin.ModelAdmin):
    # Filtro lateral por categoría
    list_filter = ('categoria',)  # También puedes añadir 'moneda' si lo deseas

    # Definición base de fieldsets
    fieldsets = (
        (None, {
            'fields': ('nombre', 'descripcion', 'precio', 'moneda', 'categoria', 'ruta_imagen')
        }),
    )

    def ver_imagen(self, obj):
        if obj and obj.ruta_imagen:
            return format_html('<img src="{}" width="200" height="auto" />', obj.ruta_imagen.url)
        return "No hay imagen"
    ver_imagen.short_description = "Imagen del producto"

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        if obj:
            fieldsets = list(fieldsets)
            first = fieldsets[0]
            fields = list(first[1]['fields'])
            fields.append('ver_imagen')
            fieldsets[0] = (first[0], {'fields': tuple(fields)})
            return tuple(fieldsets)
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        readonly = super().get_readonly_fields(request, obj)
        if obj:
            return readonly + ('ver_imagen',)
        return readonly

admin.site.register(Producto, ProductoAdmin)
admin.site.register(Categoria)
admin.site.register(Compra)
admin.site.register(Cliente)
admin.site.register(Moneda)