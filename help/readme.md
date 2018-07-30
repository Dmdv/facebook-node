# Manual Deployment in chat

Ansible deployment must reproduce the same scenario as described in deployment log

```
docker build -t echo .
```

```
docker run -d echo --name=echo
```


#### Example sequence when deploying manually with docker:

```
docker build --tag redshift_django:latest --pull .
docker rmi $(docker images --filter "dangling=true" --quiet)
docker tag redshift_django:latest localhost:5000/redshift_django:latest
docker push localhost:5000/redshift_django:latest
docker rmi localhost:5000/redshift_django:latest
```

##### From Remote:

```
docker pull localhost:5000/redshift_django:latest
```

##### Pull out build tag

```
git describe --candidates=1 --abbrev=0
```

##### Run migrations

```
docker run --env DJANGO_SETTINGS_MODULE=main.settings.open.localhost --env APP_VERSION=postgis_removal_prod --volume /data/media:/media --volume /data/report:/report --volume /etc/cert:/etc/cert:ro --volume /etc/db_host:/etc/db_host:ro --add-host localhost:172.0.0.1 --net redshift --rm --tty localhost:5000/redshift_django:latest python manage.py showmigrations --plan | egrep "^\[ \]"; true
```

##### Rename and stop

```
docker inspect --type container api_backup
docker rename api api_backup
docker stop --time 10 api_backup
```

##### Run container

```
docker run --log-opt max-size=10m --log-opt max-file=100 --sysctl net.core.somaxconn=511 --dns 10.48.112.100 --dns 10.48.112.101 --name api --publish 8001:8001 --env DJANGO_SETTINGS_MODULE=main.settings.open.localhost --env APP_VERSION=postgis_removal_prod --volume /data/media:/media --volume /data/report:/report --volume /etc/cert:/etc/cert:ro --volume /etc/db_host:/etc/db_host:ro --add-host localhost:172.0.0.1 --net redshift --restart unless-stopped --detach localhost:5000/redshift_django:latest
```
