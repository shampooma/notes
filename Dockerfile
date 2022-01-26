FROM node:current-alpine3.15 as base

WORKDIR /app

FROM base as prod

COPY src src
COPY gatsby-browser.js \
  gatsby-config.js \
  gatsby-ssr.js \
  wrap-with-provider.js \
  package-lock.json \
  package.json \
  tsconfig.json \
  ./

RUN npm ci --production && npm run build

CMD []

FROM base as dev

CMD []