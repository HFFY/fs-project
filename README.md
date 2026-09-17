# fs-project

Aplicación full stack para gestionar tareas: crear, listar, editar y eliminar tareas, con registro y login de usuarios mediante JWT.

[![CI](https://github.com/HFFY/fs-project/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/HFFY/fs-project/actions/workflows/ci.yml)

## 🚀 Instalación local

```bash
git clone https://github.com/HFFY/fs-project
cd fs-project/task-manager-react
npm install

# Backend
cd backend
npm install
```

### Variables de entorno

Los `.env` reales nunca se suben; solo las plantillas `.env.example`. Genera `JWT_SECRET` con `openssl rand -hex 32`.

```bash
cp .env.example .env                                            # docker compose
cp task-manager-react/backend/.env.example task-manager-react/backend/.env   # backend en local
```

| Variable | Sensible | Dónde vive en CI |
|----------|----------|------------------|
| `DATABASE_URL` | Sí | GitHub Secret |
| `JWT_SECRET` | Sí | GitHub Secret |
| `PORT` | No | — |
| `NODE_ENV` | No | — |

Si falta `DATABASE_URL` o `JWT_SECRET`, el backend no arranca.

## 📜 Comandos disponibles

| Comando          | Descripción                                            |
|------------------|--------------------------------------------------------|
| `npm run dev`    | Levanta el entorno de desarrollo                        |
| `npm run build`  | Genera el build de producción (frontend)                |
| `npm run lint`   | Analiza el código con ESLint (frontend)                 |
| `npm test`       | Corre las pruebas automatizadas (pendiente — Sesión 3)  |

## 🗄️ Base de datos

PostgreSQL con migraciones y seeds gestionados con Prisma (ver Módulo 2). Modelos: `Task` y `User`.

## 🧱 Stack

- **Frontend:** React 19 + TypeScript + Vite + React Router
- **Backend:** Node.js + Express 5 + TypeScript
- **Auth:** JWT + bcrypt
- **ORM / BD:** Prisma + PostgreSQL

## 📁 Estructura

```
fs-project/
└── task-manager-react/
    ├── src/            # Frontend React (components, pages)
    └── backend/        # API Express + Prisma
```

## 🔌 Endpoints principales

| Método | Ruta          | Descripción                   |
|--------|---------------|-------------------------------|
| GET    | `/tasks`      | Lista las tareas              |
| POST   | `/tasks`      | Crea una tarea                |
| PUT    | `/tasks/:id`  | Actualiza una tarea           |
| DELETE | `/tasks/:id`  | Elimina una tarea             |
| POST   | `/users`      | Registra un usuario           |
| POST   | `/login`      | Inicia sesión y devuelve token|
| GET    | `/profile`    | Datos del usuario (requiere token) |
