# EventForge Frontend

Frontend client for EventForge built with React 19, TypeScript, Vite, and TailwindCSS.

## Directory Structure
- `src/`: React source code (components, services, hooks, types, data)
- `index.html`: Main HTML entry point
- `vite.config.ts`: Vite build and dev configuration
- `tsconfig.json`: TypeScript compiler options
- `vercel.json`: Single Page Application (SPA) routing configuration
- `.env.example`: Example environment configuration

## Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Set `VITE_API_URL` to your backend API URL (e.g., `http://localhost:5000/api` for local or your Render URL in production).

### 3. Run Development Server
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
Build output will be generated in `dist/`.
