# Running locally

start the db, geoserver, mapserver

`docker-compose -f docker-build/docker-compose.dev.yml up`

cd into `ngeo-api/api` folder and run the following:

`poetry run python manage.py migrate`

`poetry run python manage.py initadmin`

`poetry run python manage.py runserver_plus`

Ensure that you change db url host to localhost in the `.env` file.

cd into the ngeo-ui folder and run.

`yarn start`

Ensure you change the api host to include the `:8000` port in the `.env` file

# Running in prod

change db host to `db` in the .env file.

run

`docker-compose -f docker-build/docker-compose.prod.yml up`
