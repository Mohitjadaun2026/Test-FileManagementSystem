# 📁 FileLoad - Modern File Management System

> A production-ready file management platform with **Google OAuth**, **JWT authentication**, **real-time processing**, and a beautiful responsive UI.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Angular](https://img.shields.io/badge/Angular-17+-red)
![Spring%20Boot](https://img.shields.io/badge/Spring%20Boot-3.3+-green)
![Node](https://img.shields.io/badge/Node-18+-yellow)

---

## ✨ Features

- 🔐 **Google OAuth 2.0** - Seamless social login
- 🔑 **JWT Authentication** - Secure token-based auth
- 📤 **File Upload** - Drag-drop CSV file uploads with progress tracking
- ⚡ **Real-time Processing** - Status updates: PENDING → PROCESSING → SUCCESS/FAILED
- 🔍 **Advanced Search** - Filter by name, date, status, record count
- 📊 **Dashboard** - File statistics and analytics
- 👤 **User Profiles** - Editable profile with image upload
- 🎨 **Modern UI** - Built with Angular Material, fully responsive
- 📱 **Mobile Ready** - Works seamlessly on mobile devices
- 🛡️ **Secure API** - Global exception handling, CORS protection

---

## 🏗️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Angular | 17+ |
| **Backend** | Spring Boot | 3.3+ |
| **Database** | MySQL | 8.0+ |
| **Auth** | JWT + Google OAuth 2.0 | - |
| **Package Manager** | npm / Maven | Latest |
| **UI Framework** | Angular Material | 17+ |

---

## 📋 Prerequisites

Before you start, make sure you have these installed:

```bash
# Check versions
java -version          # Java 21+
mvn -v                 # Maven 3.9+
node -v                # Node.js 18+
npm -v                 # npm 9+
mysql --version        # MySQL 8.0+
```

### Quick Install (if missing)

- **Java 21**: https://www.oracle.com/java/technologies/downloads/#java21
- **Maven**: https://maven.apache.org/download.cgi
- **Node.js**: https://nodejs.org/ (includes npm)
- **MySQL**: https://dev.mysql.com/downloads/mysql/

---

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Clone & Navigate
```powershell
git clone https://github.com/Mohitjadaun2026/Test-FileManagementSystem.git
cd Test-FileManagementSystem
```

### 2️⃣ Setup Google OAuth (REQUIRED for login)

#### Create Google OAuth Client
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `filemanagementsystem`
3. Enable OAuth 2.0 API
4. Create OAuth 2.0 Client ID (Web Application)
5. Add redirect URI:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```

#### Copy Credentials to Backend
Create `backend/api/.env` file:
```dotenv
DB_URL=jdbc:mysql://localhost:3306/file_load_mgmt?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google

JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRATION=86400000

SERVER_PORT=8080
SERVER_SSL_ENABLED=false
```

### 3️⃣ Start Backend (Terminal 1)
```powershell
cd backend/api
mvn spring-boot:run
```
✅ Backend runs on: `http://localhost:8080`

### 4️⃣ Start Frontend (Terminal 2)
```powershell
cd frontend
npm install
ng serve --open
```
✅ Frontend opens at: `http://localhost:4200`

### 5️⃣ Login & Explore
- Click "Continue with Google"
- Log in with your Google account
- Start uploading files!

---

## 📂 Project Structure

```
Test-FileManagementSystem/
│
├── 📦 frontend/                          # Angular App (Port 4200)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/              # UI Components
│   │   │   │   ├── login/               # Login page
│   │   │   │   ├── register/            # Registration page
│   │   │   │   ├── file-list/           # Files listing
│   │   │   │   ├── file-upload/         # Upload form
│   │   │   │   ├── dashboard/           # Analytics dashboard
│   │   │   │   ├── profile/             # User profile
│   │   │   │   └── navbar/              # Navigation bar
│   │   │   ├── services/                # API Services
│   │   │   │   ├── auth.service.ts      # Authentication
│   │   │   │   ├── file-load.service.ts # File operations
│   │   │   │   └── auth.interceptor.ts  # JWT interceptor
│   │   │   ├── guards/                  # Route guards
│   │   │   ├── models/                  # TypeScript models
│   │   │   └── app.module.ts            # Main module
│   │   └── environments/                # Config files
│   ├── angular.json
│   ├── package.json
│   └── README_SIMPLE.md
│
├── 🛠️ backend/                          # Spring Boot API (Port 8080)
│   ├── api/                             # REST API Module
│   │   ├── src/main/java/
│   │   │   ├── controller/              # REST Endpoints
│   │   │   │   ├── AuthController.java
│   │   │   │   └── FileLoadController.java
│   │   │   ├── service/                 # Business Logic
│   │   │   ├── security/                # JWT, OAuth2
│   │   │   ├── exception/               # Global Exception Handler
│   │   │   └── config/                  # Spring Config
│   │   ├── src/main/resources/
│   │   │   └── application.yml          # Configuration
│   │   ├── .env                         # Secrets (not committed)
│   │   └── .env.example                 # Template
│   │
│   ├── service/                         # Service Logic Module
│   │   └── FileLoadServiceImpl.java
│   │
│   ├── dao/                             # Data Access Module
│   │   └── UserAccountRepository.java
│   │
│   ├── model/                           # Entity Models
│   │   └── UserAccount.java
│   │
│   └── pom.xml                          # Maven Config
│
├── 📄 README.md                         # This file
├── .gitignore                           # Git ignore rules
└── package.json                         # NPM Helper Scripts
```

---

## 🔧 Environment Setup

### Backend Configuration (`.env` file)

The backend loads from `backend/api/.env` file using Spring's config import:

```yaml
# In application.yml
spring:
  config:
    import: optional:file:.env[.properties]
```

**Don't commit `.env`** - it's already in `.gitignore`

### Frontend Configuration

**File:** `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

Change this if backend runs on a different port.

---

## 🔐 OAuth 2.0 Setup (Detailed)

### For Developers

Each developer needs their own Google OAuth credentials:

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **Create/Select Project**
   - Click project selector (top)
   - Create new project

3. **Enable OAuth 2.0 API**
   - Search: "Google+ API"
   - Click "Enable"

4. **Create OAuth Client**
   - Left menu → APIs & Services → Credentials
   - Click "Create Credentials" → OAuth 2.0 Client ID
   - Choose: Web application
   - Name: `FileLoad Local Dev`

5. **Add Authorized Origins**
   ```
   http://localhost:4200
   http://localhost:8080
   http://127.0.0.1:4200
   http://127.0.0.1:8080
   ```

6. **Add Redirect URIs**
   ```
   http://localhost:8080/login/oauth2/code/google
   ```

7. **Copy Credentials**
   - Download as JSON (optional)
   - Copy Client ID and Secret
   - Paste into `backend/api/.env`

### Login Flow

```
User clicks "Continue with Google"
  ↓
Redirects to Google Login
  ↓
User authenticates
  ↓
Google redirects to http://localhost:8080/login/oauth2/code/google
  ↓
Backend validates code with Google
  ↓
Backend creates/finds user
  ↓
Backend generates JWT token
  ↓
Frontend receives token & stores in localStorage
  ↓
Redirected to /files dashboard
  ↓
✅ Logged In!
```

---

## 📊 API Documentation

### Interactive API Testing (Swagger UI)

Once backend is running, visit:

```
http://localhost:8080/swagger-ui.html
```

**Available Endpoints:**
- `POST /api/auth/login` - Traditional login
- `POST /api/auth/register` - Sign up
- `GET /api/auth/oauth2/google` - Google OAuth
- `POST /api/auth/upload-profile` - Profile image
- `GET /api/file-loads` - List all files
- `GET /api/file-loads/my` - Your files
- `GET /api/file-loads/{id}` - File details
- `POST /api/file-loads` - Upload file
- `PUT /api/file-loads/{id}/status` - Update status
- `DELETE /api/file-loads/{id}` - Delete file

---

## 🎯 Common Commands

### Start Development Servers

```powershell
# Terminal 1 - Backend
cd backend/api
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm start
# or
ng serve
```

### Build for Production

```powershell
# Frontend
npm --prefix frontend run build
# Output: frontend/dist/

# Backend
mvn -f backend/pom.xml clean package
# Output: backend/api/target/api-1.0.0-SNAPSHOT.jar
```

### Run Tests

```powershell
# Backend unit tests
mvn -f backend/pom.xml test

# Frontend unit tests
npm --prefix frontend test
```

### Database Operations

```powershell
# Start MySQL
net start MySQL80

# Connect to database
mysql -u root -p

# View tables
USE file_load_mgmt;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

---

## 🐛 Troubleshooting

### "Port 8080 in use"
```powershell
# Use different port
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

### "Port 4200 in use"
```powershell
ng serve --port 4201
```

### "MySQL connection failed"
```powershell
# Start MySQL service
net start MySQL80

# Test connection
mysql -u root -p

# Check credentials in .env file
```

### "Google login not working"
- ✓ Check Google OAuth Client ID in `.env`
- ✓ Verify redirect URI: `http://localhost:8080/login/oauth2/code/google`
- ✓ Check browser console (F12) for errors
- ✓ Verify backend is running

### "Build fails"
```powershell
# Clean and rebuild
mvn clean install -DskipTests

# Clear cache
rm -r ~/.m2/repository
mvn clean install
```

### "npm install errors"
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall
npm --prefix frontend install --legacy-peer-deps
```

---

## 🚀 Deployment

### Production Checklist

- [ ] All tests passing
- [ ] `.env` file with production credentials
- [ ] Database backup configured
- [ ] CORS updated for production domain
- [ ] Google OAuth redirect URI updated
- [ ] Swagger UI disabled (optional)
- [ ] SSL certificate configured
- [ ] Environment variables set on server

### Deploy Backend

```powershell
# Build JAR
mvn -f backend/pom.xml clean package

# Copy to server
scp backend/api/target/api-1.0.0-SNAPSHOT.jar user@server:/app/

# Run on server
java -jar api-1.0.0-SNAPSHOT.jar
```

### Deploy Frontend

```powershell
# Build
npm --prefix frontend run build

# Deploy dist/ folder to web server (Nginx, Apache, etc.)
```

---

## 📚 Learning Resources

| Topic | Resource |
|-------|----------|
| Angular | [Angular Docs](https://angular.io/docs) |
| Spring Boot | [Spring Boot Docs](https://spring.io/projects/spring-boot) |
| OAuth 2.0 | [RFC 6749](https://tools.ietf.org/html/rfc6749) |
| JWT | [jwt.io](https://jwt.io/) |
| MySQL | [MySQL Docs](https://dev.mysql.com/doc/) |

---

## 💡 Development Tips

1. **Use Chrome DevTools**
   - F12 → Network tab to debug API calls
   - Console tab for JavaScript errors

2. **Check Backend Logs**
   - Terminal where backend runs shows all logs
   - Look for ERROR or Exception messages

3. **Database Debugging**
   ```powershell
   mysql> USE file_load_mgmt;
   mysql> SELECT * FROM users;
   mysql> SELECT * FROM file_loads;
   ```

4. **Postman/Insomnia**
   - Import API from Swagger: `/v3/api-docs`
   - Test endpoints without UI

5. **Angular DevTools**
   - Install Angular DevTools Chrome extension
   - Debug component state in real-time

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push: `git push origin feature/my-feature`
4. Create Pull Request

### Git Workflow (Mohit Branch)

```powershell
# View current branch
git branch --show-current

# Push to Mohit branch
git push origin Mohit

# Pull latest changes
git pull origin Mohit

# If rejected, rebase
git pull --rebase origin Mohit
git push origin Mohit
```

---

## 📞 Support & Issues

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Cannot connect to database | Start MySQL: `net start MySQL80` |
| Backend won't start | Check port 8080 is free |
| Frontend shows 404 | Check `apiBaseUrl` in `environment.ts` |
| Google login fails | Verify OAuth credentials in `.env` |
| File upload fails | Check file size < 50MB |

### Getting Help

1. Check Swagger docs: `http://localhost:8080/swagger-ui.html`
2. Read backend logs in terminal
3. Check browser console (F12)
4. Review error response in Network tab

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**FileLoad Development Team**  
March 2026

---

## 🎉 Getting Started Checklist

- [ ] Installed Java, Maven, Node.js, MySQL
- [ ] Created Google OAuth credentials
- [ ] Created `backend/api/.env` with credentials
- [ ] Started MySQL: `net start MySQL80`
- [ ] Started backend: `mvn spring-boot:run`
- [ ] Started frontend: `ng serve`
- [ ] Opened `http://localhost:4200`
- [ ] Tested Google login
- [ ] Uploaded a test file
- [ ] Viewed dashboard & file list

✅ **You're ready to go!**

---

**Last Updated:** March 21, 2026  
**Project Status:** ✅ Production Ready  
**Version:** 1.0.0

