# File Load Management System

This repository contains a full-stack File Load Management System.

- `frontend/` -> Angular UI
- `backend/` -> Spring Boot multi-module backend (`api`, `service`, `dao`, `model`)

Use this guide to set up and run the project on a fresh machine.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Run the Project](#run-the-project)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Developer Workflow](#developer-workflow)

## Tech Stack

- Frontend: Angular + Angular Material
- Backend: Spring Boot + Spring Security + Spring Batch
- Database: MySQL
- Build tools: Maven (backend), npm (frontend)

## Project Structure

```text
file-load-ui-Test-main/
  frontend/
	src/
	angular.json
	package.json
  backend/
	pom.xml
	api/
	service/
	dao/
	model/
```

## Prerequisites

Install the following:

- Java 21+
- Maven 3.9+
- Node.js 18+ and npm
- MySQL 8+

Verify installations:

```powershell
java -version
mvn -v
node -v
npm -v
```

If `mvn` is not recognized, use full path in commands:

```powershell
C:\Users\acer\tools\apache-maven-3.9.9\bin\mvn.cmd -v
```

## Backend Setup

Backend config file:

- `backend/api/src/main/resources/application.yml`

Default local DB config:

- URL: `jdbc:mysql://localhost:3306/file_load_mgmt?...`
- Username: `root`
- Password: configured via `DB_PASSWORD` fallback in `application.yml`

Optional: set env vars before starting backend:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/file_load_mgmt?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="<your_password>"
$env:JWT_SECRET="<base64_secret>"
```

Build backend modules:

```powershell
Set-Location "C:\Users\acer\Downloads\file-load-ui-Test-main\backend"
mvn -DskipTests clean install
```

## Frontend Setup

Install dependencies:

```powershell
Set-Location "C:\Users\acer\Downloads\file-load-ui-Test-main\frontend"
npm install
```

Build frontend:

```powershell
npm run build
```

## Run the Project

Use two terminals.

### Terminal 1: Backend

```powershell
Set-Location "C:\Users\acer\Downloads\file-load-ui-Test-main\backend\api"
mvn spring-boot:run
```

If `mvn` is not recognized:

```powershell
Set-Location "C:\Users\acer\Downloads\file-load-ui-Test-main\backend\api"
C:\Users\acer\tools\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
```

### Terminal 2: Frontend

```powershell
Set-Location "C:\Users\acer\Downloads\file-load-ui-Test-main\frontend"
npm start
```

### Access URLs

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

File Load:

- `POST /api/file-loads`
- `GET /api/file-loads`
- `GET /api/file-loads/{id}`
- `PATCH /api/file-loads/{id}`
- `PUT /api/file-loads/{id}/status`
- `POST /api/file-loads/{id}/retry`
- `POST /api/file-loads/{id}/archive`
- `DELETE /api/file-loads/{id}`
- `GET /api/file-loads/{id}/download`

## Troubleshooting

### 1) Port 8080 already in use

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess |
  ForEach-Object { Stop-Process -Id $_ -Force }
```

Then start backend again.

### 2) `mvn` not recognized

Refresh PATH in current terminal:

```powershell
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
mvn -v
```

### 3) Main class not found error

Run backend from `backend/api`, not from `backend` parent with plain `spring-boot:run`.

### 4) Frontend cannot call backend

- Confirm backend is running on port `8080`
- Confirm `frontend/src/environments/environment.ts` has API base URL `http://localhost:8080/api`
- Check browser network tab for exact HTTP errors

### 5) Uploaded file not visible where expected

Uploads are saved under backend runtime working directory, usually:

- `backend/api/uploads/`

## Developer Workflow

Recommended day-to-day flow:

1. Start MySQL
2. Start backend
3. Start frontend
4. Implement feature
5. Test via UI and Swagger
6. Run backend compile/tests
7. Commit/push

Useful commands:

```powershell
# Backend compile (fast)
Set-Location "C:\Users\acer\Downloads\file-load-ui-Test-main\backend"
mvn -DskipTests -pl service,api -am compile

# Backend tests for service module
mvn -pl service -am test

# Frontend build
Set-Location "C:\Users\acer\Downloads\file-load-ui-Test-main\frontend"
npm run build
```




