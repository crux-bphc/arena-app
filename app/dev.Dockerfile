FROM node:lts-alpine3.21

ENV NODE_ENV development
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV COREPACK_INTEGRITY_KEYS=0

RUN corepack enable

WORKDIR /app

COPY ./app/package.json ./
COPY ./app/pnpm-lock.yaml ./
COPY ./app/tsconfig.json ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY ./app .

CMD pnpm run dev --host --port $APP_PORT