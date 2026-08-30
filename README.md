# LMSproject

This repository contains a full-stack Learning Management System made of:

- Frontend: Next.js application
- Backend: Strapi CMS + API server

Repository:

```bash
git clone https://github.com/101rror/LMSproject.git
cd LMSproject
```

## Requirements

Before running the project, make sure you have installed:

- Node.js 20+
- npm 9+
- PostgreSQL (recommended for local Strapi development)
- Git

## Project structure

```bash
LMSproject/
├── backend/
│   ├── .env.example
│   ├── config/
│   ├── src/
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── .env.local.example
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── README.md
└── README.md
```

## 1) Start the backend (Strapi)

Open a terminal and run:

```bash
cd backend
npm install
copy .env.example .env
```

Update the `.env` file with your local database settings and secret values.

The project already includes a working Strapi environment example with these defaults:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="toBeModified1,toBeModified2"
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
JWT_SECRET=tobemodified
ENCRYPTION_KEY=tobemodified
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=//create
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false
```

If PostgreSQL is not running yet, create the database:

Then start Strapi:

```bash
npm run develop
```

The Strapi admin panel will be available at:

```text
http://localhost:1337/admin
```

For production-like build/start:

```bash
npm run build
npm run start
```

## 2) Start the frontend (Next.js)

In a second terminal, run:

```bash
cd frontend
npm install
copy .env.local.example .env.local
```

Set the Strapi API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
```

Then run the frontend:

```bash
npm run dev
```

The app will run at:

```text
http://localhost:3000
```

For production build:

```bash
npm run build
npm run start
```

## 3) Run both projects together

Keep both terminals open:

- Backend: `cd backend && npm run develop`
- Frontend: `cd frontend && npm run dev`

Once both are running:

- Frontend: http://localhost:3000
- Backend API: http://localhost:1337
- Strapi admin: http://localhost:1337/admin

## 4) Common issues and fixes

### Backend does not start

Check the following:

- PostgreSQL is installed and running
- Database credentials in `.env` are correct
- Database `lms` exists
- Node modules are installed using `npm install`

### Frontend cannot connect to backend

Verify that `frontend/.env.local` contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
```

If the backend is running on a different host or port, update the value accordingly.

### Missing Strapi secrets

The backend `.env` file must include valid values for:

- `APP_KEYS`
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

If needed, generate new values and paste them into `.env`.

## 5) Useful commands

### Backend

```bash
cd backend
npm install
npm run develop
npm run build
npm run start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## 6) Notes

This project uses:

- Next.js for the frontend UI
- Strapi as the content and API backend
- PostgreSQL as the recommended database

The frontend communicates with the Strapi API through `NEXT_PUBLIC_API_URL`, and Strapi itself runs on port `1337` by default.

If you want to contribute or deploy this project, keep the backend and frontend environment files secure and never commit production secrets.
