# 🛒 E-commerce — Desafio Técnico

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5178C6?logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-2.5-60A5FA?logo=biome&logoColor=white)

Sistema de **carrinho de compras online** desenvolvido como desafio técnico Full Stack.
O projeto é um **monorepo** que reúne uma **API RESTful** (Node.js) e uma **interface web**
(React/Next.js), permitindo listar produtos, montar um carrinho e finalizar a compra.

> O objetivo do desafio é demonstrar decisões técnicas, boas práticas e capacidade de
> resolver problemas em um cenário simplificado de e-commerce.

---

## ✅ To-do do desafio

### Front-end

- [x] Exibir a lista de produtos disponíveis (nome, descrição e imagem estática de exemplo).
- [x] Adicionar produtos ao carrinho.
- [x] Visualizar o carrinho com **nome**, **quantidade** e **subtotal** de cada item.
- [x] Atualizar a quantidade ou remover itens individualmente.
- [x] Visualizar o **valor total** da compra.
- [x] Finalizar a compra enviando os dados do carrinho ao back-end.
- [ ] _(Extra)_ Produtos no formato **booking** (seleção de data e horário / check-in).

### Back-end

- [x] `GET /produtos` — retornar a lista de produtos disponíveis.
- [x] `POST /carrinho` — adicionar um produto ao carrinho.
- [x] `PUT /carrinho` — atualizar a quantidade de um item ou removê-lo.
- [x] `POST /finalizar-compra` — concluir a compra, **registrar a venda no banco** e
      **enviar e-mail de confirmação** ao usuário com os detalhes.

### Requisitos e observações

- [x] Persistência em **banco de dados relacional** (MySQL, PostgreSQL, …) para produtos e vendas.
- [x] Armazenamento temporário do carrinho (memória, cookies ou sessão) — _opcional_.
- [x] Sistema **seguro** contra ataques comuns.
- [x] Código **limpo, organizado** e seguindo boas práticas.
- [x] Instruções claras para executar front-end e back-end em localhost.

### Diferenciais técnicos (extras)

- [x] [Zod](https://zod.dev) — validação.
- [x] [Tailwind CSS](https://tailwindcss.com).
- [x] React hooks.
- [x] [React Hook Form](https://react-hook-form.com).
- [x] [TanStack Query](https://tanstack.com/query).
- [ ] [TypeORM](https://typeorm.io).
- [ ] [NestJS](https://nestjs.com) — _(este projeto adota Fastify)_.

---

## 🧱 Stack e decisões técnicas

O projeto é um **monorepo gerenciado com pnpm workspaces**, separando `api` e `web`.

| Camada | Ferramenta | Papel |
| --- | --- | --- |
| API | [Fastify](https://fastify.dev) | Framework HTTP performático para Node.js |
| API | [Zod](https://zod.dev) | Validação de schemas e variáveis de ambiente |
| API | [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod) | Integração de tipos/validação Zod ↔ Fastify |
| API | [@fastify/swagger](https://github.com/fastify/fastify-swagger) + [Scalar](https://github.com/scalar/scalar) | Documentação OpenAPI interativa em `/docs` |
| API | [tsx](https://tsx.is) | Execução de TypeScript em desenvolvimento (watch) |
| Web | [Next.js 16](https://nextjs.org) + [React 19](https://react.dev) | Framework front-end (App Router, React Compiler) |
| Web | [Tailwind CSS v4](https://tailwindcss.com) | Estilização utilitária |
| Web | [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) | Componentes acessíveis |
| Web | [lucide-react](https://lucide.dev) | Ícones |
| Tooling | [pnpm workspaces](https://pnpm.io/workspaces) | Gerenciamento do monorepo |
| Tooling | [Biome](https://biomejs.dev) | Linter + formatter unificado (config raiz + `extends` na `web`) |
| Tooling | [Husky](https://typicode.github.io/husky) | Git hooks (`pre-commit` e `commit-msg`) |
| Tooling | [lint-staged](https://github.com/lint-staged/lint-staged) | Roda o Biome apenas nos arquivos em stage |
| Tooling | [commitlint](https://commitlint.js.org) + [gitmoji](https://gitmoji.dev) | Padronização de mensagens de commit |

---

## 🔧 Pré-requisitos

- **Node.js** 22+ (recomendado 24+)
- **pnpm** 11+ (o repositório declara `devEngines`; o pnpm faz o download automático se necessário)
- **Docker** + **Docker Compose** (para subir o PostgreSQL local)

---

## 🚀 Como executar

Todos os comandos são executados a partir da **raiz do projeto**. A API sobe em
`http://localhost:3333` e o front-end (Next.js) em `http://localhost:3000`.

### 1. Instalar as dependências

```bash
pnpm install
```

### 2. Configurar as variáveis de ambiente da API

```bash
cp api/.env.example api/.env
```

Preencha os valores conforme a tabela em [Variáveis de ambiente](#-variáveis-de-ambiente).
Para o e-mail de confirmação, use um provedor SMTP real (ex.: uma _App Password_ do Gmail).

### 3. Subir o banco de dados (PostgreSQL via Docker)

```bash
docker compose -f api/docker-compose.yml up -d
```

### 4. Rodar as migrations e popular o banco

```bash
pnpm --filter api db:migrate
pnpm --filter api db:seed
```

### 5. Rodar a API

```bash
pnpm --filter api dev
```

- API disponível em `http://localhost:3333`
- Documentação (Scalar/OpenAPI) em `http://localhost:3333/docs`

### 6. Rodar o front-end

Crie `web/.env.local` apontando para a API:

```bash
# web/.env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3333
```

```bash
pnpm --filter web dev
```

- Aplicação disponível em `http://localhost:3000`

---

## 🔐 Variáveis de ambiente

### API — `api/.env`

Validadas em tempo de execução com Zod (`api/src/shared/env.ts`). A API **não sobe** se
alguma variável obrigatória estiver ausente:

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `PORT` | Não | `3000` | Porta HTTP da API (use `3333`) |
| `DATABASE_URL` | Sim | — | String de conexão do PostgreSQL |
| `SMTP_HOST` | Sim | — | Host do servidor SMTP |
| `SMTP_PORT` | Sim | — | Porta do servidor SMTP (ex.: `587`) |
| `SMTP_USER` | Sim | — | Usuário/remetente SMTP |
| `SMTP_PASS` | Sim | — | Senha ou _App Password_ SMTP |

### Web — `web/.env.local`

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Sim | — | URL base da API (`http://localhost:3333`) |

---

## 🧠 Decisões técnicas

- **Carrinho no `localStorage` do cliente** (`web/src/utils/cart-storage.ts`): montar o
  carrinho é um estado efêmero e específico de cada usuário, então ele vive no navegador
  (persistido via TanStack Query). Isso dispensa sessão no servidor e mantém a API sem
  estado — o back-end só é acionado no checkout, quando o pedido é de fato criado e finalizado.
- **`POST` e `PUT /carrinho` são a "API de pedido" exigida pelo desafio**: o enunciado pede
  os endpoints de adicionar item e de atualizar quantidade/remover. Ambos existem e funcionam,
  mas hoje o front **não** chama `PUT /carrinho` — a edição de quantidade acontece no carrinho
  local e o pedido é materializado de uma só vez no checkout. O endpoint foi mantido para
  cumprir o contrato do desafio e permitir manipular um pedido já persistido no servidor.
- **Preço sempre do banco**: o `POST /carrinho` ignora qualquer preço vindo do cliente e usa
  o `priceInCents` persistido, evitando adulteração do valor da compra.
- **Venda registrada no checkout**: o pedido nasce `pending` e só vira `paid` em
  `POST /finalizar-compra`, que é **idempotente** — uma segunda chamada retorna `409` e não
  reenvia o e-mail de confirmação.

---

## 🧪 Qualidade de código

O **Biome** centraliza lint e formatação. A configuração vive em `biome.json` na raiz e é
herdada pela `web/biome.json` via `"extends": "//"` (que ainda adiciona regras específicas
de Next.js, React e Tailwind).

Git hooks (via Husky) garantem a qualidade automaticamente:

- **`pre-commit`** → roda o `lint-staged`, aplicando `biome check --write` nos arquivos em stage.
- **`commit-msg`** → valida a mensagem com `commitlint` (Conventional Commits + gitmoji).
  O **escopo é obrigatório** (`scope-empty`).

Exemplos de commit válidos:

```bash
✨ feat(produtos): adiciona listagem de produtos
🐛 fix(carrinho): corrige cálculo do subtotal
```
