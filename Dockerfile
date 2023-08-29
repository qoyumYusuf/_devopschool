# syntax=docker/dockerfile:1
#stage II
FROM node:20.5.1-alpine3.18 AS base

WORKDIR /opt/chameleon

ENV NODE_ENV = "production"

#stage II
FROM base AS packages

COPY ["package*.json", "./"]
#install dependencies for production
RUN npm ci --omit=dev;

#stage III
#Image for production
FROM base
COPY . .
COPY --from=packages --chown=node:node ["/opt/chameleon/node_modules", "./node_modules" ]
RUN set -ex; echo "Smoke TEST output:"; ls -lah; echo $PORT; echo $NODE_ENV;
USER node
CMD ["node", "src/index.js"]