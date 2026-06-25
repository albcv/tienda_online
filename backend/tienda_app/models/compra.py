from django.db import models
from .producto import Producto  
from .cliente import Cliente
from .moneda import Moneda   

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
        max_digits=20,
        decimal_places=2,
        help_text="Monto total de la compra"
    )
    moneda = models.ForeignKey(
        Moneda,
        on_delete=models.PROTECT,
        help_text="Moneda en la que se realizó la compra"
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
        return f"Compra #{self.id} - {self.cliente.user.username} - Total: {self.moneda.simbolo}{self.total}"