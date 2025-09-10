# Usa uma imagem base para a compilação do Rust
FROM rust:latest AS builder

# Define o diretório de trabalho dentro do container
# O WORKDIR precisa ser a raiz do seu workspace
WORKDIR /app

# Copia os arquivos de código
COPY . .

# Compila o projeto em modo de otimização (release), especificando o pacote
RUN cargo build --release -p ficha-api

# Usa uma imagem base menor para o binário final
FROM debian:stable-slim

# Copia o binário compilado, que agora estará no diretório correto
COPY --from=builder /app/target/release/ficha-api /usr/local/bin/ficha-api

# Expõe a porta que o seu servidor irá rodar
EXPOSE 8000

# Comando para rodar a aplicação quando o container iniciar
CMD ["ficha-api"]