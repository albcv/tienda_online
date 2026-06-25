# Archivo: producto.py
from django.db import models
from .categoria import Categoria
from .moneda import Moneda

class Producto(models.Model):
    nombre = models.CharField(
        max_length=100,
        help_text="Nombre del producto (mínimo 3 caracteres)",
        unique=True
    )
    descripcion = models.TextField(
        max_length=500,
        help_text="Descripción del producto (mínimo 10 caracteres)"
    )
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Precio del producto en dólares"
    )
    ruta_imagen = models.ImageField(
        upload_to='productos/',
        blank=True,
        null=True,
        help_text="Imagen del producto"
    )

    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    moneda = models.ForeignKey(Moneda, on_delete=models.PROTECT, null=True)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return self.nombre

    # Validaciones de longitud mínima
    def clean(self):
        from django.core.exceptions import ValidationError
        if len(self.nombre) < 3:
            raise ValidationError({'nombre': 'El nombre debe tener al menos 3 caracteres.'})
        if len(self.descripcion) < 10:
            raise ValidationError({'descripcion': 'La descripción debe tener al menos 10 caracteres.'})