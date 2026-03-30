# Archivo: compra.py
from django.db import models
from .producto import Producto  
from .cliente import Cliente

class Compra(models.Model):
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name='compras',
        help_text="Cliente que realizó la compra"
    )
    productos = models.ManyToManyField(
        Producto,
        related_name='compras',
        help_text="Productos incluidos en la compra"
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto total de la compra"
    )
    fecha_compra = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora de la compra"
    )

    class Meta:
        verbose_name = "Compra"
        verbose_name_plural = "Compras"
        ordering = ['-fecha_compra']

    def __str__(self):
        return f"Compra #{self.id} - {self.usuario.username} - Total: {self.total}"