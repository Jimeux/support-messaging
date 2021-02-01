ARG SERVICE

FROM golang:1.15.7-buster AS builder
WORKDIR /go/src/github.com/Jimeux/support-system/${SERVICE}
COPY . .
# Build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /go/bin/service

FROM scratch

# Run as non-privileged user
COPY --from=builder /etc/passwd /etc/passwd
USER nobody

COPY --from=builder /go/bin/service /service

EXPOSE 8080

ENTRYPOINT ["/service"]
