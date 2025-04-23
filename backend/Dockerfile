# ---- Build stage ----
FROM rust:1.81 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

# ---- Dev stage ----
FROM rust:1.81 as dev
WORKDIR /app
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*
RUN cargo install cargo-watch
COPY . .
EXPOSE 8080
CMD ["cargo", "watch", "-x", "run"]

# ---- Runtime stage ----
FROM debian:bookworm-slim
WORKDIR /app
# Installa le librerie necessarie per OpenSSL 3
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/backend /app/backend
COPY ./schema.sql ./recipe.db ./
EXPOSE 8080
CMD ["/app/backend"]
