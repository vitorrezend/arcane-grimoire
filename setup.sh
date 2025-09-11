#!/bin/bash

# Script para configurar e iniciar o ambiente de desenvolvimento.
#
# COMO USAR:
# 1. Dê permissão de execução ao script:
#    chmod +x setup.sh
# 2. Execute o script:
#    ./setup.sh
#
# Em sistemas Windows, você pode executar este script usando o Git Bash ou o WSL.

# --- Funções Auxiliares ---

# Função para verificar se um comando existe no PATH.
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# --- Início do Script ---

echo "🚀 Iniciando o script de configuração do ambiente..."
echo "----------------------------------------------------"

# 1. Verificar se o Docker está instalado e rodando.
if ! command_exists docker; then
    echo "❌ Erro: Docker não encontrado."
    echo "   Por favor, instale o Docker para continuar."
    echo "   Instruções: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Erro: O Docker Daemon não parece estar rodando."
    echo "   Por favor, inicie o serviço do Docker e tente novamente."
    exit 1
fi
echo "✅ Docker encontrado e rodando."

# 2. Verificar se o Docker Compose V2 está disponível.
if ! docker compose version >/dev/null 2>&1; then
    echo "❌ Erro: Docker Compose (V2) não encontrado."
    echo "   O Docker Compose agora é um plugin do Docker e vem com o Docker Desktop."
    echo "   Certifique-se de que sua versão do Docker está atualizada."
    exit 1
fi
echo "✅ Docker Compose encontrado."

# 3. Verificar e criar o arquivo .env se necessário.
if [ ! -f .env ]; then
    echo "📄 Arquivo .env não encontrado. Tentando criar a partir de .env.example..."
    if [ ! -f .env.example ]; then
        echo "❌ Erro: Arquivo .env.example não encontrado. Não é possível criar o .env."
        exit 1
    fi
    cp .env.example .env
    echo "✅ Arquivo .env criado com sucesso."
    echo "   ⚠️ IMPORTANTE: Abra o arquivo .env e, se necessário, ajuste as variáveis para o seu ambiente."
else
    echo "👍 Arquivo .env já existe. Nenhuma ação necessária."
fi

# 4. Iniciar os containers com Docker Compose.
echo "🐳 Iniciando os serviços com Docker Compose... (Isso pode levar alguns minutos na primeira vez)"
docker compose up -d --build

if [ $? -eq 0 ]; then
    echo "----------------------------------------------------"
    echo "🎉 Ambiente configurado e iniciado com sucesso!"
    echo ""
    echo "Para visualizar os logs dos containers, use: docker compose logs -f"
    echo "Para parar todos os serviços, use: docker compose down"
else
    echo "❌ Erro ao iniciar os serviços com Docker Compose. Verifique os logs de erro acima."
    exit 1
fi
