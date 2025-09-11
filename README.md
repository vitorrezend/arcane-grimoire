# Arcane Grimoire

**Gerenciador de fichas de RPG para o sistema Mago: A Ascensão.**

Este projeto fornece um ambiente de desenvolvimento completo e containerizado para a aplicação Arcane Grimoire, utilizando Docker para gerenciar o backend em Rust, os bancos de dados (PostgreSQL e MongoDB) e o frontend.

## Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas e rodando em seu sistema:

- **[Docker](https://docs.docker.com/get-docker/)**: A plataforma de containerização usada para rodar todos os serviços do projeto. O Docker Desktop para Windows e Mac já inclui o `docker-compose`.
- **[Git](https://git-scm.com/downloads)**: Para clonar o repositório.
- **Um terminal com Bash**:
    - **Linux/macOS**: Já vem instalado por padrão.
    - **Windows**: Recomendamos o uso do [Git Bash](https://gitforwindows.org/) (que é instalado com o Git) ou o [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/pt-br/windows/wsl/install).

## Como Começar

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento localmente.

### 1. Clone o Repositório

Primeiro, clone este repositório para a sua máquina local:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd arcane-grimoire
```

### 2. Execute o Script de Configuração

Nós criamos um script para automatizar todo o processo de configuração. Para executá-lo, primeiro dê a ele permissão de execução e depois o rode:

```bash
chmod +x setup.sh
./setup.sh
```

**O que o script faz?**

- **Verifica as dependências**: Confere se o Docker e o Docker Compose estão instalados e rodando.
- **Cria o arquivo `.env`**: Se o arquivo `.env` de configuração de ambiente não existir, ele será criado a partir do template `.env.example`. Este arquivo guarda as senhas e configurações dos bancos de dados.
- **Inicia os serviços**: Constrói as imagens dos containers (se necessário) e inicia todos os serviços em segundo plano usando `docker compose up -d --build`.

Após a execução do script, o ambiente estará pronto e rodando!

### 3. Acesse a Aplicação

- **Backend**: A API estará disponível em `http://localhost:8000`.
- **Banco de Dados (PostgreSQL)**: Acessível na porta `5432`.
- **Banco de Dados (MongoDB)**: Acessível na porta `27017`.

## Comandos Úteis do Docker

Aqui estão alguns comandos úteis para gerenciar os seus containers:

- **Ver os logs em tempo real**:
  ```bash
  docker compose logs -f
  ```

- **Parar todos os serviços**:
  ```bash
  docker compose down
  ```

- **Listar containers em execução**:
  ```bash
  docker compose ps
  ```

---
*Este projeto foi configurado para ser simples e rápido de iniciar. Se encontrar algum problema, verifique se o Docker está rodando corretamente.*
