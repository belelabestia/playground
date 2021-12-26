dotnet publish .\PlaygroundApi\
npm --prefix .\playground-app\ run build
docker compose --file .\docker\docker-compose.mount.yml --project-directory . --project-name playground-mount up --build