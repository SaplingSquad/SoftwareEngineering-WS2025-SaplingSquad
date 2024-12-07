# Cache-Stage: install dependencies
FROM node:22-alpine AS cache

WORKDIR /cache

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci

# Build-Stage: build app
FROM node:22-alpine AS build

WORKDIR /build

COPY --from=cache /cache/node_modules ./node_modules

COPY ./ ./

RUN npm run build

# Final run-image
FROM node:22-alpine AS run

WORKDIR /app

COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/server ./server
COPY --from=build /build/dist ./dist

EXPOSE 3000

ENTRYPOINT [ "node", "server/entry.express" ]
