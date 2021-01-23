FROM golang:1.15.7-buster AS builder
WORKDIR /go/src/github.com/Jimeux/support-messaging/user-service
COPY . .
# build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /go/bin/user-service

FROM scratch

# don't run as root user
COPY --from=builder /etc/passwd /etc/passwd
USER nobody

COPY --from=builder /go/bin/user-service /user-service

ENTRYPOINT ["/user-service"]
