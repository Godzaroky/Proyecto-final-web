# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# LEVELUP — Videogame Tracker Frontend (Fase 1)

**STW-26 · Universidad del Valle de Guatemala**
Tema: Videojuegos | React 18 + Vite + LocalStorage

## Descripción

Aplicación CRUD para gestionar una biblioteca personal de videojuegos.
Persiste los datos en LocalStorage usando useState con lazy initializer
y useEffect para sincronización. La conexión al backend ocurre en Fase 2.

## Requisitos

- Node.js 18+
- npm

## Instalación y uso

\`\`\`bash
npm install
npm run dev
# → http://localhost:5173
\`\`\`

## Mis primeros Items

![Primeros juegos](backend/docs/captura-items.png)
