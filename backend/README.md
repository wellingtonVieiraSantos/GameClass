# 📚 Cantinho Pedagógico — Backend

> Este projeto é apenas para fins de portfólio. Uso, cópia ou redistribuição não são permitidos sem autorização.

API REST construída com **NestJS**, **Prisma** e **PostgreSQL** para a plataforma educacional Cantinho Pedagógico.

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) instalado globalmente (`npm i -g pnpm`)
- [PostgreSQL](https://www.postgresql.org/) rodando localmente ou via Docker

---

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/cantinho-pedagogico.git
cd cantinho-pedagogico/backend
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (pasta `backend/`), baseando-se no exemplo abaixo:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/cantinho_pedagogico"

JWT_SECRET="seu_jwt_secret_aqui"
```

### 4. Aplicar as migrations do banco de dados

```bash
pnpm exec prisma migrate dev
```

### 5. (Opcional) Executar o seed de dados

Popula o banco com dados iniciais (admin, professor, alunos, turma e badges):

```bash
pnpm seed
```

### 6. Iniciar o servidor

```bash
# Modo desenvolvimento (com hot reload)
pnpm start:dev

# Modo produção
pnpm build
pnpm start:prod
```

O servidor estará disponível em: `http://localhost:3000`

A documentação interativa **Swagger** estará disponível em: `http://localhost:3000/api`

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm start` | Inicia o servidor em modo normal |
| `pnpm start:dev` | Inicia o servidor em modo watch (hot reload) |
| `pnpm start:debug` | Inicia o servidor em modo debug |
| `pnpm start:prod` | Inicia a versão de produção compilada |
| `pnpm build` | Compila o projeto para a pasta `dist/` |
| `pnpm seed` | Executa o seed do banco de dados |
| `pnpm lint` | Executa o linter e corrige problemas automaticamente |
| `pnpm format` | Formata o código com Prettier |
| `pnpm test` | Executa os testes unitários |
| `pnpm test:watch` | Executa os testes em modo watch |
| `pnpm test:cov` | Executa os testes com relatório de cobertura |
| `pnpm test:e2e` | Executa os testes end-to-end |

---

## 🗂️ Documentação da API

Todas as rotas que exigem autenticação necessitam do envio de um `Bearer Token` no header `Authorization`:

```
Authorization: Bearer <access_token>
```

---

### 🔐 Autenticação (`/auth`)
*Rotas públicas — não requerem token.*

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth/register` | Cadastrar um novo usuário |
| `POST` | `/auth/login` | Login — retorna `access_token` e `refresh_token` |
| `POST` | `/auth/refresh` | Renovar tokens com o `refresh_token` |
| `POST` | `/auth/logout` | Logout — invalida o `refresh_token` |

---

### 👤 Usuário (`/user`)
*Requer Autenticação (Bearer Token).*

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/user/me` | Busca os dados do usuário logado |
| `PUT`  | `/user/me/avatar` | Atualiza o avatar do usuário logado |
| `PUT`  | `/user/me/name` | Atualiza o nome do usuário logado |
| `PUT`  | `/user/me/password` | Atualiza a senha do usuário logado |

---

### 🛡️ Admin (`/admin`)
*Requer Autenticação com Role `ADMIN`.*

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/admin/users` | Listar todos os usuários |
| `GET`  | `/admin/users/:id` | Buscar usuário por ID |
| `POST` | `/admin/users` | Criar um novo usuário |
| `PUT`  | `/admin/users/:id` | Atualizar dados de um usuário |
| `DELETE` | `/admin/users/:id` | Deletar um usuário |

---

### 🏫 Turma (`/classroom`)
*Requer Autenticação com Role `TEACHER`.*

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/classroom` | Criar uma nova turma |
| `DELETE` | `/classroom/:id` | Remover uma turma |
| `GET`  | `/classroom/:id/students` | Listar alunos de uma turma |
| `POST` | `/classroom/:id/students/:studentId` | Adicionar aluno à turma |
| `DELETE` | `/classroom/:id/students/:studentId` | Remover aluno da turma |
| `POST` | `/classroom/:id/students/:studentId/scores` | Adicionar/atualizar pontuação de um aluno |
| `GET`  | `/classroom/:id/badges` | Listar badges da turma |
| `POST` | `/classroom/:id/badges` | Criar um badge na turma |
| `PUT`  | `/classroom/:id/badges/:badgeId` | Atualizar um badge |
| `DELETE` | `/classroom/:id/badges/:badgeId` | Remover um badge da turma |

---

### 🎓 Aluno (`/student`)
*Requer Autenticação com Role `STUDENT`.*

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/student/badges` | Buscar badges ganhos pelo aluno |
| `POST` | `/student/badges/:id/equip` | Equipar um badge (define como badge ativo) |
| `GET`  | `/student/classrooms` | Buscar a turma do aluno |
| `GET`  | `/student/classmates` | Buscar colegas de sala do aluno |

---

### ⏱️ Tempo (`/time`)
*Rota pública — não requer token.*

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/time/current-week` | Busca a semana atual do sistema |
