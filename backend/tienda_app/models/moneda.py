from django.db import models

class Moneda(models.Model):
    nombre = models.CharField(max_length=20, unique=True)
    codigo = models.CharField(max_length=3, unique=True)
    simbolo = models.CharField(max_length=5)

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"