# Brev.ly — server

API do encurtador de URL: Fastify, Drizzle ORM, Postgres e Cloudflare R2 para o export em CSV.

## Pré-requisitos

- Node.js 24
- pnpm 11
- Docker, com Docker Compose

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha todas as chaves. A aplicação não sobe com env inválida.

Com o Postgres do Compose, a URL do banco é:

```
DATABASE_URL=postgresql://docker:docker@localhost:5433/brevly
```

## Desenvolvimento

```bash
docker compose up -d      # sobe só o Postgres (porta 5433)
pnpm install
pnpm db:migrate           # aplica as migrations
pnpm dev                  # API em http://localhost:$PORT
```

Outros scripts: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm start`, `pnpm db:generate` e `pnpm db:studio`.

## Testes

Os testes precisam do Postgres do Compose no ar. O setup cria e migra o banco `brevly_test`.

```bash
pnpm test
```

## Docker

As migrations não rodam na imagem. Rode `pnpm db:migrate` pelo host antes de subir o container.

Gerar a imagem:

```bash
docker build -t brevly-server .
```

Rodar a API com o Postgres pelo Compose. O perfil `app` usa o `.env` e aponta o `DATABASE_URL` para o serviço `postgres`:

```bash
docker compose --profile app up -d --build
docker compose --profile app down
```

Para rodar com `docker run`, passe as variáveis pelo ambiente. O `--env-file` do Docker não remove aspas dos valores. Com `CLOUDFLARE_PUBLIC_URL="https://..."`, as aspas chegam junto e a validação falha.

```bash
docker run --rm -p 3333:3333 --env-file .env -e DATABASE_URL=postgresql://docker:docker@host.docker.internal:5433/brevly brevly-server
```

A imagem roda com o usuário `node`, não root, e traz `HEALTHCHECK` em `GET /health`.
