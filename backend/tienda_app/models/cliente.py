from django.contrib.auth.models import User
from django.db import models

class Cliente(models.Model):
    """Extiende el modelo User de Django con número de tarjeta y teléfono."""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    numero_tarjeta = models.CharField(
        max_length=19,
        help_text="Número de tarjeta (16 dígitos, solo números)",
        unique=True
    )
    telefono = models.CharField(
        max_length=20,
        help_text="Número de teléfono (solo dígitos, entre 7 y 15 dígitos)",
        unique=True
    )
    direccion = models.CharField(
        max_length=300,
        unique=True,
        verbose_name="Dirección"
    )

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

    def __str__(self):
        return f"Cliente {self.user.username}"

    def clean(self):
        from django.core.exceptions import ValidationError
        import re

        # Validación para numero_tarjeta
        numero_limpio = re.sub(r'[\s\-]', '', self.numero_tarjeta)
        if not numero_limpio.isdigit():
            raise ValidationError({'numero_tarjeta': 'El número de tarjeta debe contener solo dígitos.'})
        if len(numero_limpio) != 16:
            raise ValidationError({'numero_tarjeta': 'El número de tarjeta debe tener exactamente 16 dígitos.'})

        # Validación para teléfono
        telefono_limpio = re.sub(r'[\s\-]', '', self.telefono)
        if not telefono_limpio.isdigit():
            raise ValidationError({'telefono': 'El número de teléfono debe contener solo dígitos.'})
        if len(telefono_limpio) < 7 or len(telefono_limpio) > 15:
            raise ValidationError({'telefono': 'El número de teléfono debe tener entre 7 y 15 dígitos.'})