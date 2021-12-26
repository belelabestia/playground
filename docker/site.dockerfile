FROM node AS builder
WORKDIR /repo
COPY playground-app .
RUN npm install
RUN npm run build

FROM nginx AS prod
WORKDIR /site
COPY --from=builder /dist/app .
COPY docker/playground-site.conf /etc/nginx/conf.d/default.conf