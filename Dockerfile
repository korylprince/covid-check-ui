FROM alpine:3.12 as builder

ARG VERSION

RUN apk add --no-cache git nodejs nodejs-npm

RUN git clone --branch "$VERSION" --single-branch --depth 1 \
    https://github.com/korylprince/covid-check-ui.git /client

WORKDIR /client

RUN npm install

RUN npm run build-prod

FROM caddy:2.1.1

COPY --from=builder /client/dist /site/client

COPY ./Caddyfile /etc/caddy/Caddyfile
