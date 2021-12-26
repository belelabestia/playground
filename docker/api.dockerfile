FROM mcr.microsoft.com/dotnet/sdk AS builder
WORKDIR /repo
COPY PlaygroundApi .
RUN dotnet publish

FROM mcr.microsoft.com/dotnet/aspnet AS prod
WORKDIR /api
COPY --from=builder /dist/api .
ENTRYPOINT ["dotnet", "PlaygroundApi.dll"]