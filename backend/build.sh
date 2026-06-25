#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

# Crear superusuario solo si las variables están definidas
if [[ -n "$DJANGO_SUPERUSER_USERNAME" ]] && [[ -n "$DJANGO_SUPERUSER_PASSWORD" ]] && [[ -n "$DJANGO_SUPERUSER_EMAIL" ]]; then
    python manage.py createsuperuser --noinput || echo "Superusuario ya existe, continuando..."
fi