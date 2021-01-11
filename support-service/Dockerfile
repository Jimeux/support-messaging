ARG MODULE

# build
FROM golang:1.14.0-alpine AS build
WORKDIR /go/src/$MODULE
COPY . /go/src/$MODULE
RUN go build -o bin/service .

# run
FROM alpine
WORKDIR /go/src/$MODULE
COPY --from=build /go/src/$MODULE/bin/service /go/src/$MODULE/bin/service

CMD ["./bin/service"]
