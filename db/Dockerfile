FROM alpine:latest

ARG PB_VERSION=0.23.12

RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

COPY ./migrations /pb/pb_migrations

CMD /pb/pocketbase serve --http=0.0.0.0:$PB_PORT