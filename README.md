# Brev.ly

Encurtador de URL: cadastro, listagem e remoção de links, redirecionamento pelo código encurtado com contagem de acessos, e exportação dos links em CSV.

O repositório tem dois pacotes independentes (não é workspace), cada um com seu `package.json`:

```
server/   API REST (Fastify + Drizzle + Postgres), export em CSV para o Cloudflare R2, Dockerfile
web/      SPA (React + Vite) que consome a API
```

## Stack

| Pacote   | Tecnologias |
|----------|-------------|
| `server` | TypeScript, Fastify, Zod, Drizzle ORM, Postgres (postgres.js), Cloudflare R2 (AWS SDK S3), csv-stringify, Vitest, Biome, Docker |
| `web`    | TypeScript, React, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod, Phosphor Icons, Biome |

## Pré-requisitos

- Node.js 24
- pnpm 11
- Docker, com Docker Compose
- Um bucket no Cloudflare R2 com URL pública (usado só pela exportação em CSV)

## Como rodar localmente

### 1. server

```bash
cd server
cp .env.example .env      # preencha todas as chaves (tabela abaixo)
docker compose up -d      # sobe só o Postgres, na porta 5433
pnpm install
pnpm db:migrate           # aplica as migrations
pnpm dev                  # API em http://localhost:$PORT
```

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta da API, por exemplo `3333` |
| `DATABASE_URL` | Com o Postgres do Compose: `postgresql://docker:docker@localhost:5433/brevly` |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta no Cloudflare |
| `CLOUDFLARE_ACCESS_KEY_ID` | Access key do token de API do R2 |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | Secret key do token de API do R2 |
| `CLOUDFLARE_BUCKET` | Nome do bucket |
| `CLOUDFLARE_PUBLIC_URL` | URL pública do bucket, por exemplo `https://pub-xxxx.r2.dev` |

A aplicação não sobe com variável ausente ou inválida.

Os testes precisam do Postgres do Compose no ar e usam um banco separado (`brevly_test`):

```bash
pnpm test
```

Para gerar a imagem Docker e rodar a API em container, veja [server/README.md](server/README.md).

### 2. web

```bash
cd web
cp .env.example .env
pnpm install
pnpm dev                  # SPA em http://localhost:5173
```

| Variável | Descrição |
|----------|-----------|
| `VITE_FRONTEND_URL` | URL em que a SPA está servida, por exemplo `http://localhost:5173`. É a base dos links encurtados |
| `VITE_BACKEND_URL` | URL da API, por exemplo `http://localhost:3333` |
| `VITE_DISPLAY_DOMAIN` | Opcional. Domínio exibido como prefixo do campo "link encurtado"; vazio vale `brev.ly` |

`pnpm dev` e `pnpm build` falham se as duas primeiras estiverem ausentes. `pnpm build` gera a versão de produção em `web/dist`, e `pnpm preview` serve esse build.

## Scripts

Nos dois pacotes: `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint`.

Só no `server`: `pnpm start`, `pnpm test`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`.

## API

| Método e rota | Descrição |
|---------------|-----------|
| `POST /links` | Cria um link. `400` para dados inválidos, `409` para código já existente |
| `GET /links` | Lista todos os links, do mais recente para o mais antigo |
| `GET /links/:shortUrl` | Obtém a URL original pelo código encurtado |
| `PATCH /links/:id/access` | Incrementa a contagem de acessos |
| `DELETE /links/:id` | Remove um link |
| `POST /links/exports` | Gera o CSV no R2 e devolve a URL pública do arquivo |
| `GET /health` | Verificação de saúde |

## Páginas

| Rota | Página |
|------|--------|
| `/` | Formulário de cadastro e lista de links |
| `/:shortUrl` | Redirecionamento para a URL original |
| qualquer outra | Link não encontrado |
