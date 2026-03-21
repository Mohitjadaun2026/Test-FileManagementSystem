# File Management System

A complete file management platform where users can upload, process, and track files.

**Frontend:** Angular | **Backend:** Spring Boot | **Database:** MySQL

---

## 🎯 What It Does

✅ User Registration & Login (JWT Authentication)  
✅ Upload CSV Files  
✅ Real-time Processing Status Tracking  
✅ View File Details & Records  
✅ Search & Filter Files  

**Status Flow:** `PENDING → PROCESSING → SUCCESS/FAILED`

---

## 📋 Prerequisites (Install Once)

| Tool | Version | Check |
|------|---------|-------|
| Java | 21+ | `java -version` |
| Maven | 3.9+ | `mvn -v` |
| Node.js | 18+ | `node -v` |
| npm | Latest | `npm -v` |
| MySQL | 8.0+ | `mysql --version` |

---

## 📁 Project Structure

```
Test-FileManagementSystem/
├─�� frontend/           # Angular web app (port 4200)
├── backend/            # Spring Boot API (port 8080)
│   ├── api/           # REST endpoints & security
│   ├── service/       # Business logic
│   ├── dao/           # Database repositories
│   └── model/         # Entities & DTOs
├── README.md          # This file
└── package.json       # Helper scripts
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Clone & Navigate
```powershell
cd Test-FileManagementSystem
```

### Step 2: Start Backend (Terminal 1)
```powershell
npm run backend
```
✓ Runs on `http://localhost:8080`  
✓ API Docs: `http://localhost:8080/swagger-ui.html`

### Step 3: Start Frontend (Terminal 2)
```powershell
npm run frontend
```
✓ Runs on `http://localhost:4200`  
✓ Open in browser automatically

---

## 📚 Full Setup & Commands

### First Time Setup
```powershell
# Install frontend dependencies
npm --prefix frontend install

# Build backend (optional)
mvn -f backend/pom.xml -DskipTests clean install
```

### Daily Development (Run Both)

**Backend:**
```powershell
npm run backend
# OR
mvn -f backend/api/pom.xml spring-boot:run
```

**Frontend:**
```powershell
npm run frontend
# OR
npm --prefix frontend start
```

### Access Points
| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:4200 | Web Application |
| Backend API | http://localhost:8080/api | REST API |
| API Docs | http://localhost:8080/swagger-ui.html | Interactive API Testing |

---

## ⚙️ Configuration

### Backend Database
**File:** `backend/api/src/main/resources/application.yml`

Default settings:
```
Database: file_load_mgmt (auto-created)
Host: localhost:3306
Username: root
Password: (set via $env:DB_PASSWORD)
```

**Set Custom Password:**
```powershell
$env:DB_PASSWORD="your_password"
npm run backend
```

### Frontend API URL
**File:** `frontend/src/environments/environment.ts`

```typescript
apiBaseUrl: 'http://localhost:8080/api'
```

Change if backend runs on different port.

---

## 💾 File Storage

- **Uploaded Files Location:** `backend/api/uploads/`
- **File Metadata:** Stored in MySQL database
- **Auto-cleanup:** Files with database records

---

## 🔄 How It Works (User Flow)

### 1. Register
User creates account → Backend stores in DB → Can now login

### 2. Login
Credentials submitted → JWT token generated → Stored in browser

### 3. Upload File
Select file → Frontend validates → Upload to backend → Status: PENDING

### 4. Processing
Backend processes file → Updates status → Counts records

### 5. View & Search
View all files → Filter by name/date/status → Click for details

### 6. Details Page
Complete file info → Record count → Error messages (if any)

---

## 🛠️ Troubleshooting

### Backend Issues

**Port 8080 in use?**
```powershell
mvn -f backend/api/pom.xml spring-boot:run -Dserver.port=8081
```

**Database connection error?**
```powershell
# Start MySQL
net start MySQL80

# Verify connection
mysql -u root -p
```

**Build fails?**
```powershell
mvn clean install -DskipTests
```

### Frontend Issues

**Port 4200 in use?**
```powershell
npm start -- --port 4201
```

**npm install fails?**
```powershell
npm --prefix frontend install --legacy-peer-deps
```

**API calls fail?**
- ✓ Check backend is running
- ✓ Verify API URL in `environment.ts`
- ✓ Open DevTools (F12) → Network tab

---

## 📖 Separate Documentation

For detailed setup instructions:

- **Frontend Only:** `frontend/README_SIMPLE.md`
- **Backend Only:** `backend/README_SIMPLE.md`

---

## 🎓 Feature Walkthrough

### User Registration
1. Click Register
2. Enter username, email, password
3. Account created in database
4. Auto-redirect to login

### File Upload
1. Click "Upload File"
2. Select CSV file
3. File uploads with progress bar
4. Status shows as PENDING

### Monitor Processing
1. Go to File List
2. Watch status change: PENDING → PROCESSING → SUCCESS
3. Record count updates automatically

### Search Files
1. Use search box with filters
2. Filter by: Name, Date, Status, Record Count
3. Click file to see full details

### View File Details
1. Click any file in list
2. See: Name, Size, Date, Status, Record Count
3. Download or delete if available

---

## 🔐 Security

- **JWT Authentication:** Tokens expire after 24 hours
- **Password Hashing:** Bcrypt encryption in database
- **CORS:** Configured for `localhost:4200`
- **Protected Routes:** All sensitive endpoints require token

---

## 📊 Database Schema

Auto-created tables:
- **users** - User accounts (username, email, password hash)
- **file_loads** - File metadata (name, status, record count)
- **file_load_errors** - Error logs (if processing fails)

---

## 🚢 Production Checklist

Before deploying:
- ✓ All tests passing
- ✓ Backend builds successfully
- ✓ Database credentials secured
- ✓ Frontend API URL updated for production
- ✓ CORS settings adjusted for production domain
- ✓ Swagger UI disabled in production (optional)

---

## 📝 Git Workflow (Mohit Branch)

### Push Your Changes
```powershell
git branch --show-current
git add .
git commit -m "your message"
git push origin Mohit
```

### If Push Rejected
```powershell
git pull --rebase origin Mohit
git push origin Mohit
```

### View Branches
```powershell
git branch -a
```

---

## 💡 Tips for New Developers

1. **Start Here First** - Read this README before anything
2. **Use npm Scripts** - Don't run Maven directly, use npm scripts
3. **Keep Both Terminals Open** - Backend and frontend must run together
4. **Check Swagger** - Visit API docs to test endpoints
5. **Dev Tools** - Use F12 in browser for debugging
6. **Console Logs** - Check browser console for client-side errors
7. **Network Tab** - Debug API calls in Network tab (F12)

---

## 🎯 Common Tasks

### Add New Frontend Component
```powershell
cd frontend
ng generate component components/my-component
```

### Add New Backend Endpoint
1. Create controller in `backend/api/src/main/java/com/fileload/controller/`
2. Inject service from `backend/service/`
3. Test with Swagger UI

### Change Database Password
```powershell
$env:DB_PASSWORD="new_password"
npm run backend
```

### Build Production
```powershell
# Frontend
npm --prefix frontend run build

# Backend
mvn -f backend/pom.xml clean package
```

---

## 📞 Quick Reference

| Need | Command |
|------|---------|
| Start Both | `npm run backend` (T1) + `npm run frontend` (T2) |
| Open Frontend | http://localhost:4200 |
| API Docs | http://localhost:8080/swagger-ui.html |
| Database Setup | `net start MySQL80` |
| View Branches | `git branch -a` |
| Push Code | `git push origin Mohit` |
| Check Status | `git status` |

---

## ✨ What's Included

✓ Complete Angular Frontend  
✓ Multi-module Spring Boot Backend  
✓ MySQL Database Integration  
✓ JWT Authentication  
✓ File Upload & Processing  
✓ Search & Filtering  
✓ Swagger API Documentation  
✓ Error Handling  
✓ Responsive UI with Angular Material  

---

**Last Updated:** March 2026  
**Project:** File Management System  
**Team:** Development Team







