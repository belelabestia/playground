docker load -i images/playground-api.image
docker load -i images/playground-site.image
docker load -i images/postgres.image
docker compose --file .\docker\docker-compose.prod-mount.yml --project-directory . --project-name playground-prod-mount up -d