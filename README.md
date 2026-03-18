# File Management System

This project is a **File Management System** built with:
- `frontend/` -> Angular web application
- `backend/` -> Spring Boot API (multi-module Maven project)

This README is written in simple language so that any new team member can run and understand the project quickly.

---

## 1) What This Project Does

The system helps users:
1. Register and login
2. Upload trade files (CSV)
3. Track file processing status
4. View file details and record count
5. Search and filter file history

### Status flow used in project

`PENDING -> PROCESSING -> SUCCESS / FAILED`

So when a file is uploaded, it is first shown as pending, then processed in backend, then finally marked success or failed.

---

## 2) Project Structure

```text
file-load-ui-Test-main/
  frontend/                  # Angular app
  backend/                   # Spring Boot multi-module backend
	api/                     # REST controllers, security, app startup
	service/                 # business logic + batch orchestration
	dao/                     # repositories
	model/                   # entities and DTOs
  package.json               # root helper scripts
  README.md
```

---

## 3) Prerequisites (Install Once)

Install these tools first:
- Java 21+
- Maven 3.9+
- Node.js 18+ (npm included)
- MySQL 8+

Check installation with:

```powershell
java -version
mvn -v
node -v
npm -v
```

If `mvn` is not recognized, Maven is not added to PATH.

---

## 4) One-Time Setup

Open terminal in project root:

```powershell
cd "C:\Users\acer\Downloads\file-load-ui-Test-main"
```

Install frontend dependencies:

```powershell
npm --prefix frontend install
```

Optional backend build check:

```powershell
mvn -f backend/pom.xml -DskipTests clean install
```

---

## 5) Run the Project (Day-to-Day)

Run backend and frontend in **two separate terminals**.

### Terminal 1 - Backend

```powershell
cd "C:\Users\acer\Downloads\file-load-ui-Test-main"
npm run backend
```

### Terminal 2 - Frontend

```powershell
cd "C:\Users\acer\Downloads\file-load-ui-Test-main"
npm run frontend
```

### Open URLs

- Frontend app: `http://localhost:4200`
- Backend API base: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## 6) Important Config (Database + API)

Backend config file: `backend/api/src/main/resources/application.yml`

Current local defaults:
- DB URL: `jdbc:mysql://localhost:3306/file_load_mgmt?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- DB Username: `root`
- DB Password: from `DB_PASSWORD` env var (fallback exists in config)
- Backend port: `8080`

Frontend API config file: `frontend/src/environments/environment.ts`

Current API URL:
- `http://localhost:8080/api`

If your DB credentials are different, set env vars before starting backend:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/file_load_mgmt?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_password_here"
```

---

## 7) Feature Walkthrough (Business Flow)

### A) Register
- User enters username/email/password
- Frontend sends request to backend auth API
- User account is created in database

### B) Login
- User submits credentials
- Backend validates and returns JWT token
- Frontend stores token and sends it in future requests

### C) Upload file
- User selects CSV file
- Frontend validates type/size
- File uploads with progress indicator
- Backend stores file and creates file-load record

### D) Processing
- File status is visible in list
- Backend processing updates status and record count
- Frontend refreshes to show latest status

### E) File list and filtering
- Users can search by id/name/status/date/range
- Table shows key columns and actions

### F) File details
- User can open complete details
- Shows metadata, record count, and errors if any

---

## 8) Where Data Is Saved

### Uploaded files on disk

Files are saved in:
- `backend/api/uploads/`

The backend may store files with a generated prefix for uniqueness (to avoid file name collisions).

### Metadata in database

File details (status, count, errors, etc.) are stored in database table(s) managed by backend modules.

---

## 9) Common Commands (Quick Reference)

From project root:

```powershell
# run backend
npm run backend

# run frontend
npm run frontend

# run frontend via default start
npm start
```

Backend only (from `backend/` folder):

```powershell
cd "C:\Users\acer\Downloads\file-load-ui-Test-main\backend"
npm run backend
```

---

## 10) Troubleshooting Guide

### Issue: `mvn` not recognized

Use full Maven path temporarily:

```powershell
C:\Users\acer\tools\apache-maven-3.9.9\bin\mvn.cmd -v
```

And run backend with full Maven path if needed:

```powershell
C:\Users\acer\tools\apache-maven-3.9.9\bin\mvn.cmd -f backend/api/pom.xml spring-boot:run
```

### Issue: Port 8080 already in use

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue |
Select-Object -ExpandProperty OwningProcess -Unique |
ForEach-Object { Stop-Process -Id $_ -Force }
```

Then start backend again.

### Issue: Frontend running but login/upload fails

Check these:
1. Backend is running on `http://localhost:8080`
2. Frontend API URL in `frontend/src/environments/environment.ts` is `http://localhost:8080/api`
3. Browser network tab shows 200/401/500 details

### Issue: Backend starts but database error appears

Verify:
1. MySQL service is running
2. Username/password are correct
3. DB URL points to localhost and proper port

### Issue: Swagger not opening

Confirm backend is running first, then open:
- `http://localhost:8080/swagger-ui.html`

---

## 11) Interview / Demo Checklist

Before demo, confirm:
- Backend started successfully
- Frontend started successfully
- Login works
- Upload works
- Status transitions visible
- Record count and details page visible
- Search/filter returns expected rows

---

## 12) Git Push (Mohit Branch)

If you are working on `Mohit` branch and want to push updates:

```powershell
cd "C:\Users\acer\Downloads\file-load-ui-Test-main"
git branch --show-current
git add .
git commit -m "update readme and project changes"
git push origin Mohit
```

If push is rejected (non-fast-forward):

```powershell
git pull --rebase origin Mohit
git push origin Mohit
```

---

## 13) Notes for New Developers

- Start with this README first
- Do not run backend from parent POM with plain `spring-boot:run`
- Use provided npm scripts (`npm run backend`, `npm run frontend`)
- Keep backend and frontend terminals running together while testing end-to-end flow




