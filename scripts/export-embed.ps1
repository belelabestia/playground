docker compose --file .\docker\docker-compose.embed.yml --project-directory . --project-name playground-embed build --no-cache
mkdir -f images
docker save playground-api -o images/playground-api.image
docker save playground-site -o images/playground-site.image
docker save postgres -o images/postgres.image