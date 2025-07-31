FROM golang:1.24 as builder

RUN apt-get update && apt-get install -y git

RUN go install go.k6.io/xk6/cmd/xk6@latest

WORKDIR /build

RUN echo "module k6-custom" > go.mod

RUN xk6 build \
  --with github.com/grafana/xk6-browser@latest \
  --with github.com/grafana/xk6-dashboard@latest \
  --output /k6-browser-dashboard

FROM grafana/k6:master-with-browser
COPY --from=builder /k6-browser-dashboard /usr/bin/k6
ENTRYPOINT ["k6"]
