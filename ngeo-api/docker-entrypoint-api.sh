#!/bin/bash

cd /api/

python manage.py collectstatic --noinput
python manage.py migrate 
# python manage.py initadmin

exec "$@"
