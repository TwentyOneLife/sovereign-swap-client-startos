# Builds sovereign-swap-daemon from source, pinned, so the chain from source to the running client
# stays auditable. rust:1-slim-bookworm pinned by digest (Dependabot follows the tag beside it).
FROM rust@sha256:ed2c95ca377d6571b124b05e75e01207973ded639dce7d5542eb7bcd797e32aa AS builder

ARG SWAP_REPO=https://github.com/TwentyOneLife/sovereign-swap.git
ARG SWAP_REF=v0.6.28

RUN apt-get -qq update \
 && DEBIAN_FRONTEND=noninteractive apt-get -qq install -y --no-install-recommends ca-certificates git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /build
RUN git clone "$SWAP_REPO" src && cd src && git checkout "$SWAP_REF"
RUN cd src && cargo build --locked --release --bin sovereign-swap-daemon

FROM debian:bookworm-slim@sha256:40b107342c492725bc7aacbe93a49945445191ae364184a6d24fedb28172f6f7 AS final
# curl: the opt-in price reference fetches the nonkyc ticker over Tor via curl (degrades gracefully
# if absent). ca-certificates for TLS to the exchange.
RUN apt-get -qq update \
 && DEBIAN_FRONTEND=noninteractive apt-get -qq install -y --no-install-recommends ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /build/src/target/release/sovereign-swap-daemon /usr/local/bin/sovereign-swap-daemon
WORKDIR /mnt/client
STOPSIGNAL SIGTERM
