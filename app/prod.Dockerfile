FROM node:lts-alpine3.21 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV COREPACK_INTEGRITY_KEYS=0

RUN corepack enable

WORKDIR /app

COPY ./app/package.json ./
COPY ./app/pnpm-lock.yaml ./
COPY .env ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY ./app .
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

ENV NODE_ENV production

CMD PORT=$APP_PORT pnpm start --host --port $APP_PORT
