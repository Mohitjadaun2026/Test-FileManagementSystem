# Frontend - File Management System

## Prerequisites
- Node.js 18+
- npm

## Quick Start

### 1. Install Dependencies
```powershell
cd frontend
npm install
```

### 2. Start Server
```powershell
npm start
```

### 3. Open Browser
```
http://localhost:4200
```

## Commands
```powershell
npm start              # Start dev server (port 4200)
npm run start:open     # Start and open browser
npm run build          # Build for production
npm run prod           # Run production build
```

## Config
API URL in: `src/environments/environment.ts`
```
apiBaseUrl: 'http://localhost:8080/api'
```

## Issues
- **Port 4200 in use?** → `npm start -- --port 4201`
- **npm install fails?** → `npm install --legacy-peer-deps`
- **Modules not found?** → `npm install`

**Backend must be running on http://localhost:8080/api**

