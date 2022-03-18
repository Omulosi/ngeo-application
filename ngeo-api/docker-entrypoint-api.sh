#!/bin/sh

cd /api/

python manage.py collectstatic --noinput

sleep 3

python manage.py migrate

sleep 3

python manage.py initadmin

gunicorn ngeo.wsgi -b 0.0.0.0:8000

exec "$@"