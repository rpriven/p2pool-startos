ARG P2POOL_VERSION=v4.17
FROM debian:bookworm-slim AS builder

ARG P2POOL_VERSION
ARG TARGETARCH

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp/p2pool

RUN set -eux; \
    case "${TARGETARCH}" in \
      amd64)   ASSET="p2pool-${P2POOL_VERSION}-linux-x64.tar.gz" ;; \
      arm64)   ASSET="p2pool-${P2POOL_VERSION}-linux-aarch64.tar.gz" ;; \
      riscv64) ASSET="p2pool-${P2POOL_VERSION}-linux-riscv64.tar.gz" ;; \
      *) echo "Unsupported arch: ${TARGETARCH}" && exit 1 ;; \
    esac; \
    BASE_URL="https://github.com/SChernykh/p2pool/releases/download/${P2POOL_VERSION}"; \
    wget -q "${BASE_URL}/${ASSET}" -O "${ASSET}"; \
    wget -q "${BASE_URL}/sha256sums.txt.asc" -O sha256sums.txt.asc; \
    EXPECTED="$(grep -F -A2 "Name: ${ASSET}" sha256sums.txt.asc | awk '/SHA256:/ {print $2; exit}')"; \
    test -n "${EXPECTED}"; \
    echo "${EXPECTED}  ${ASSET}" | sha256sum -c -; \
    tar -xzf "${ASSET}"; \
    find . -name 'p2pool' -type f -exec cp {} /usr/local/bin/p2pool \;; \
    chmod +x /usr/local/bin/p2pool

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/bin/p2pool /usr/local/bin/p2pool

WORKDIR /data

EXPOSE 3333
