# Getting Started Guide

Complete guide covering setup, configuration, quick reference, and documentation index in one file.

## 🚀 Quick Start

Get the application running in 6 steps:

### Step 1: Create Environment File

The `.env` file template is already in `backend/api/.env` with placeholder values (`xxxxxx`).

Update it with your actual credentials:

```powershell
cd backend/api
# Edit .env file and replace all xxxxxx values with your credentials
```

**Where to Get Each Credential:**

1. **Database Password** (DB_PASSWORD)
   - Your MySQL password (default: root, or your custom password)

2. **Google OAuth2 Credentials** (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
   - Visit: https://console.cloud.google.com/
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized redirect URIs:
     - `https://localhost:8080/login/oauth2/code/google`
     - `http://localhost:4200/oauth2-callback`
   - Copy Client ID and Secret to `.env`

3. **JWT Secret** (JWT_SECRET)
   - Use any strong random string (minimum 32 characters)
   - Example: Use a password generator or: `random_string_with_16plus_chars`

4. **Super-Admin Password** (SUPER_ADMIN_PASSWORD)
   - Your desired password for first login
   - Created automatically on first backend startup
   - Use strong password (16+ characters recommended)

5. **Email Configuration** (MAIL_SMTP_USERNAME, MAIL_SMTP_PASSWORD)
   - Username: Your Gmail email address
   - Password: Gmail App Password (NOT your regular Gmail password)
   - To generate app password:
     - Go to https://myaccount.google.com/apppasswords
     - Enable 2-factor authentication first
     - Select "Mail" and "Windows Computer"
     - Copy the 16-character app password

6. **SSL Keystore Password** (SERVER_SSL_KEY_STORE_PASSWORD)
   - Your keystore file password (for local SSL certificate)

> **For detailed information on each variable**, see `.env.example` file or full documentation below

See [Environment Setup](#environment-setup) for detailed variable descriptions.

### Step 2: Start MySQL

```powershell
# Windows service
net start MySQL80

# Or Docker
docker run --name mysql8 -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8
```

### Step 3: Start Backend

```powershell
cd backend/api
mvn spring-boot:run
```

Check: `http://localhost:8080/swagger-ui.html`

### Step 4: Start Frontend

In new terminal:

```powershell
cd frontend
npm install
npm start
```

Check: `https://localhost:4200`

### Step 5: Login

- Email: `superadmin@gmail.com` (from `.env`)
- Password: (from `SUPER_ADMIN_PASSWORD` in `.env`)

### Step 6: Test Upload

1. Click "Upload File"
2. Select a CSV file
3. Click Upload
4. File appears in "My Files" with status "PENDING"

---

## ⚡ IMPORTANT: Super-Admin First-Time Login

### 🔑 How Super-Admin Is Created

**When you start the backend for the FIRST TIME:**

1. **Backend checks**: Is there a super-admin in the database?
2. **If NO super-admin exists**: Backend automatically creates one using `.env` values:
   - Email: `SUPER_ADMIN_EMAIL`
   - Username: `SUPER_ADMIN_USERNAME`
   - Password: `SUPER_ADMIN_PASSWORD`
3. **If super-admin EXISTS**: Backend skips creation (doesn't overwrite)

### ✅ Super-Admin Creation Process

**Step 1: Create `.env` with super-admin credentials**
```dotenv
SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=admin@123
```

**Step 2: Start backend**
```powershell
cd backend/api
mvn spring-boot:run
```

**Step 3: Watch for message in logs:**
```
✅ Super-admin account created automatically
OR
✅ Super-admin already exists, skipping creation
```

**Step 4: Login with these credentials**
```
Email: superadmin@gmail.com
Password: admin@123
```

### 🎯 Key Points

✅ **First startup** - Super-admin created automatically  
✅ **Uses .env values** - Email, username, password from `.env`  
✅ **One-time only** - Created once, then never overwritten  
✅ **From database** - Fresh database? New super-admin created  
✅ **From existing DB** - Has super-admin? Uses existing one  

### ⚠️ Important Notes

- ✅ **NEW INSTALLATION**: Super-admin auto-created on first backend startup
- ✅ **Change .env values BEFORE first startup** for custom credentials
- ✅ **After first startup**: Cannot change super-admin via .env (already in DB)
- ✅ **To reset**: Delete database table & restart backend
- ✅ **Production**: Change default credentials in `.env`

### 🔄 Workflow for New User

```
1. Create .env file with SUPER_ADMIN_EMAIL & SUPER_ADMIN_PASSWORD
2. Start MySQL database
3. Start Backend API
   ↓
   (Backend auto-creates super-admin from .env)
4. Start Frontend
5. Login with super-admin email & password from .env
6. Done! ✅
```

### ❓ What If I Forget Super-Admin Password?

**Option 1: Change .env & restart**
```
1. Stop backend
2. Update .env with new SUPER_ADMIN_PASSWORD
3. Delete database: DROP DATABASE file_load_mgmt;
4. Start backend (creates new super-admin)
```

**Option 2: Use password reset**
```
1. Click "Forgot Password" on login page
2. Enter super-admin email
3. Check email for reset link
4. Reset password
```

### 🔐 Security Reminder

- ⚠️ Change `.env` passwords before production
- ⚠️ Never use default credentials in production
- ⚠️ Store `.env` securely (don't commit to git)
- ⚠️ Use strong passwords (16+ characters)

---

## 🔧 Quick Reference

### Application URLs

| Service | URL |
|---------|-----|
| Frontend | `https://localhost:4200` |
| Backend API | `http://localhost:8080` |
| API Docs | `http://localhost:8080/swagger-ui.html` |
| Health Check | `http://localhost:8080/actuator/health` |

### Quick Commands

**Start Backend**
```powershell
cd backend/api
mvn spring-boot:run
```

**Start Frontend**
```powershell
cd frontend
npm start
```

**From Root**
```powershell
npm run backend      # Start backend
npm run frontend     # Start frontend
npm start           # Start frontend (same)
```

### Database Commands

**Connect**
```powershell
mysql -h localhost -u root -p file_load_mgmt
```

**View Users**
```sql
SELECT id, email, username, role FROM user_account;
```

**View Files**
```sql
SELECT id, filename, status, record_count FROM file_load;
```

**Count Files by User**
```sql
SELECT ua.email, COUNT(fl.id) as file_count 
FROM user_account ua 
LEFT JOIN file_load fl ON ua.id = fl.uploaded_by_id 
GROUP BY ua.id;
```

**Clear All Data (⚠️ Destructive)**
```sql
TRUNCATE TABLE file_load;
TRUNCATE TABLE user_account;
ALTER TABLE file_load AUTO_INCREMENT = 1;
ALTER TABLE user_account AUTO_INCREMENT = 1;
```

### Maven Commands

```powershell
# Build
mvn clean install

# Build without tests
mvn clean install -DskipTests

# Run tests
mvn test

# Spring Boot
mvn spring-boot:run
```

### npm Commands

```powershell
# Install
npm install

# Start dev
npm start

# Build production
npm run build

# Tests
npm test

# Lint
npm run lint
```

### API Endpoints Summary

**Auth**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

**Files**
```
POST   /api/file-loads
GET    /api/file-loads/my
GET    /api/file-loads/{id}
PATCH  /api/file-loads/{id}
DELETE /api/file-loads/{id}
```

**Admin**
```
GET    /api/admin/users
PUT    /api/admin/users/{id}/block
DELETE /api/admin/users/{id}/files
```

### Default Credentials

```
Email: superadmin@gmail.com
Username: superadmin
Password: (from SUPER_ADMIN_PASSWORD in .env)
```

### Important Paths

| Path | Purpose |
|------|---------|
| `backend/api/` | API module |
| `backend/uploads/` | Uploaded files |
| `frontend/src/` | Angular app |
| `docs/` | All documentation |
| `backend/api/.env` | Configuration |
| `backend/api-run.log` | Backend logs |

### Roles & Permissions

| Role | Level |
|------|-------|
| USER | Basic user |
| ADMIN | User manager |
| SUPER_ADMIN | Full access |

| Permission Scope | Allows |
|---|---|
| USER_ACCESS_CONTROL | Block/unblock users |
| USER_RECORDS_OVERVIEW | View user files |
| USER_FILES_DELETE_ALL | Delete all user files |

---

## 📝 Environment Setup

### Complete Environment Template

Create `.env` file in `backend/api/` directory:

```dotenv
# ============================================================================
# Database Configuration
# ============================================================================
DB_URL=jdbc:mysql://localhost:3306/file_load_mgmt?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# ============================================================================
# Google OAuth2 Configuration
# ============================================================================
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://localhost:8080/login/oauth2/code/google

# ============================================================================
# JWT Configuration
# ============================================================================
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
JWT_EXPIRATION=86400000

# ============================================================================
# Super-Admin Bootstrap Configuration
# ============================================================================
# These credentials are used to create the super-admin account on FIRST startup
# After first startup, these are ignored (account is already in database)
SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=your_super_admin_password

# ============================================================================
# Server Configuration
# ============================================================================
SERVER_PORT=8080
SERVER_SSL_ENABLED=true
SERVER_SSL_KEY_STORE=classpath:keystore-local.pfx
SERVER_SSL_KEY_STORE_PASSWORD=changeit123
SERVER_SSL_KEY_STORE_TYPE=PKCS12
FRONTEND_BASE_URL=https://localhost:4200

# ============================================================================
# Email Configuration (Gmail SMTP)
# ============================================================================
# For Gmail: Generate an App Password at https://myaccount.google.com/apppasswords
MAIL_SMTP_HOST=smtp.gmail.com
MAIL_SMTP_PORT=587
MAIL_SMTP_USERNAME=your_gmail@gmail.com
MAIL_SMTP_PASSWORD=your_app_password
MAIL_FROM=your_gmail@gmail.com
```

### Variable Documentation

#### Database Configuration

**DB_URL**
- JDBC connection string for MySQL
- Creates database automatically if not exists
- Connection parameters ensure proper encoding and timezone

**DB_USERNAME**
- MySQL username (default: root)

**DB_PASSWORD**
- MySQL password for the user

#### Google OAuth2 Configuration

Get credentials from [Google Cloud Console](https://console.cloud.google.com/):

**GOOGLE_CLIENT_ID**
- OAuth2 Client ID
- Format: `123456789.apps.googleusercontent.com`

**GOOGLE_CLIENT_SECRET**
- OAuth2 Client Secret

**GOOGLE_REDIRECT_URI**
- Must match exactly in Google Cloud Console
- Local: `http://localhost:8080/login/oauth2/code/google`
- Production: `https://yourdomain.com/login/oauth2/code/google`

#### JWT Configuration

**JWT_SECRET**
- Secret key for signing JWT tokens
- Minimum 32 characters required
- Use strong random string
- Generate: `[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))`

**JWT_EXPIRATION**
- Token expiration time in milliseconds
- 86400000 = 24 hours
- 604800000 = 7 days
- 3600000 = 1 hour (testing)

#### Server Configuration

**SERVER_PORT**
- Backend server port (default: 8080)

**SERVER_SSL_ENABLED**
- Enable HTTPS
- `false` for development
- `true` for production

**SERVER_SSL_KEY_STORE**
- Path to SSL certificate keystore
- Default: `classpath:keystore-local.pfx` (local development)

**SERVER_SSL_KEY_STORE_PASSWORD**
- Password for the keystore file

**SERVER_SSL_KEY_STORE_TYPE**
- Keystore format (PKCS12 recommended)

**FRONTEND_BASE_URL**
- Frontend application URL
- Local: `https://localhost:4200`
- Production: `https://yourdomain.com`

#### Email Configuration

**MAIL_SMTP_HOST**
- SMTP server address (Gmail: smtp.gmail.com)

**MAIL_SMTP_PORT**
- SMTP port (Gmail: 587 for TLS)

**MAIL_SMTP_USERNAME**
- Gmail email address for sending emails

**MAIL_SMTP_PASSWORD**
- Gmail App Password (not regular password)
- Generate at: https://myaccount.google.com/apppasswords

**MAIL_FROM**
- Sender email address for notifications

#### Super-Admin Bootstrap

**SUPER_ADMIN_EMAIL**
- Email of initial super-admin account
- Created on first startup

**SUPER_ADMIN_USERNAME**
- Username of initial super-admin account

**SUPER_ADMIN_PASSWORD**
- Password for initial super-admin account
- Use strong password

---

## 📁 Documentation Index

All documentation organized in `docs/` folder:

### Documentation Structure

```
docs/
├── README.md                    ← Documentation Hub
├── backend/
│   ├── README.md               ← Backend overview
│   ├── architecture.md         ← System architecture
│   ├── apis.md                 ← Complete API reference (25+ endpoints)
│   ├── data-models.md          ← Database schema
│   ├── batch-processing.md     ← CSV processing workflow
│   ├── configuration.md        ← Configuration details
│   └── error-handling.md       ← Error handling patterns
├── frontend/
│   ├── README.md               ← Frontend overview
│   ├── routing-and-guards.md   ← Route configuration
│   ├── services-and-state.md   ← State management
│   └── pages/                  ← Individual page docs
│       ├── login.md
│       ├── register.md
│       ├── dashboard.md
│       ├── file-list.md
│       ├── file-details.md
│       ├── file-upload.md
│       ├── profile.md
│       ├── admin-users.md
│       ├── admin-invite.md
│       ├── forgot-password.md
│       ├── reset-password.md
│       └── oauth-callback.md
└── security/
    ├── README.md               ← Security overview
    ├── authentication.md       ← Auth mechanisms
    ├── authorization.md        ← Authorization patterns
    ├── jwt-and-oauth.md        ← Token management
    ├── roles-permissions-matrix.md
    ├── detailed-security.md
    └── hardening-checklist.md
```

### Documentation by Role

**👤 New Users**
1. Root `README.md` (overview)
2. This file - "Getting Started Guide" (setup)
3. `docs/README.md` (choose role)
4. `docs/setup-and-operations.md` (detailed setup) - Available in docs/

**👨‍💻 Backend Developers**
1. `docs/backend/README.md` (overview)
2. `docs/backend/architecture.md` (design)
3. `docs/backend/apis.md` (endpoints)
4. `docs/backend/configuration.md` (config)

**🎨 Frontend Developers**
1. `docs/frontend/README.md` (overview)
2. `docs/frontend/routing-and-guards.md` (routes)
3. `docs/frontend/pages/` (page documentation)

**🔧 DevOps/Operations**
1. This file (quick setup)
2. `docs/setup-and-operations.md` (detailed)
3. `docs/backend/configuration.md` (config)
4. `docs/security/hardening-checklist.md` (production)

**🔐 Security Team**
1. `docs/security/README.md` (overview)
2. `docs/security/authorization.md` (permissions)
3. `docs/security/hardening-checklist.md` (hardening)

### Key Documentation Files

| File | Purpose | Location |
|------|---------|----------|
| API Reference | All 25+ endpoints | `docs/backend/apis.md` |
| Configuration Guide | All settings explained | `docs/backend/configuration.md` |
| Setup Guide | Detailed setup | `docs/setup-and-operations.md` |
| Security Overview | Auth & authorization | `docs/security/` |
| Page Guides | Individual pages | `docs/frontend/pages/` |

---

## 🛠️ Detailed Setup

### Prerequisites Verification

```powershell
java -version        # Should show Java 21+
mvn -version         # Should show Maven 3.9+
node -version        # Should show Node 18+
npm -version         # Should show npm 9+
mysql --version      # Should show MySQL 8+
```

### Step-by-Step Setup

#### 1. Install Requirements

**Java 21**
- Download from [oracle.com](https://www.oracle.com/java/technologies/downloads/#java21)
- Set JAVA_HOME environment variable
- Add to PATH: `%JAVA_HOME%\bin`

**Maven 3.9+**
- Download from [maven.apache.org](https://maven.apache.org/download.cgi)
- Set MAVEN_HOME
- Add to PATH: `%MAVEN_HOME%\bin`

**Node.js 18+**
- Download from [nodejs.org](https://nodejs.org/)
- Includes npm

**MySQL 8+**
- Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- Or use Docker: `docker run --name mysql8 -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8`

#### 2. Create Environment File

```powershell
cd backend/api
# Create .env file with content from Environment Setup section above
```

#### 3. Get Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project: "TradeNest"
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google`
   - `http://localhost:4200/oauth2-callback`
6. Copy Client ID and Secret to `.env`

#### 4. Initialize Database

```powershell
mysql -h localhost -u root -p
# In MySQL:
CREATE DATABASE IF NOT EXISTS file_load_mgmt;
EXIT;
```

Database will auto-create tables on first backend startup.

#### 5. Install Frontend Dependencies

```powershell
cd frontend
npm install
```

#### 6. Start Services

**Terminal 1 - Backend**
```powershell
cd backend/api
mvn spring-boot:run
```

Wait for: `Started ApiApplication in X.XXX seconds`

**Terminal 2 - Frontend**
```powershell
cd frontend
npm start
```

Wait for: `✔ Compiled successfully`

#### 7. First-Time Setup

1. Open browser: `https://localhost:4200`
2. Accept self-signed certificate warning
3. Login with super-admin credentials
4. Create test user (register page)
5. Upload test CSV file
6. Verify file processing

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error: Communications link failure**
```
Solution:
1. Verify MySQL is running: mysql -h localhost -u root -p
2. Check credentials in .env match MySQL setup
3. Verify DB_URL is correct
4. Check port 3306 is available
```

**Error: Port 8080 already in use**
```
Solution:
1. Find process: netstat -ano | findstr :8080
2. Kill process: taskkill /PID <PID> /F
3. Or change port: SERVER_PORT=8081 in .env
```

**Error: No JWT secret configured**
```
Solution:
1. Check JWT_SECRET in .env (minimum 32 chars)
2. Restart backend after changes
```

### Frontend Won't Start

**Error: npm not found**
```
Solution:
1. Install Node.js from nodejs.org
2. Restart terminal/PowerShell
3. Verify: npm --version
```

**Error: Cannot connect to backend**
```
Solution:
1. Verify backend running: curl http://localhost:8080
2. Check environment.ts has correct apiBaseUrl
3. Check browser console for errors (F12)
```

### Database Issues

**Error: Access denied for user 'root'**
```
Solution:
1. Check DB_USERNAME and DB_PASSWORD in .env
2. Verify MySQL credentials match .env
3. Test: mysql -u root -p
```

**Error: Table doesn't exist**
```
Solution:
1. Database auto-creates on first run
2. Check backend logs: backend/api-run.log
3. Verify ddl-auto: update in application.yml
```

### Login Issues

**Can't login with super-admin**
```
Solution:
1. Verify credentials from .env
2. Check database: SELECT * FROM user_account;
3. Restart backend (tables created on startup)
```

### File Upload Issues

**File upload fails**
```
Solution:
1. Check file size < 20MB
2. Verify CSV format is valid
3. Check backend logs: backend/api-run.log
4. Verify backend is running
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or change port in .env |
| MySQL not running | Start MySQL service or Docker container |
| Wrong credentials | Verify .env values match setup |
| SSL certificate warning | Accept warning in browser (normal for localhost) |
| Frontend can't find backend | Check apiBaseUrl in environment.ts |
| Token expired | Login again to refresh |

---

## 📊 File Processing Statuses

| Status | Meaning |
|--------|---------|
| PENDING | Awaiting processing |
| PROCESSING | Currently processing |
| SUCCESS | Complete, records loaded |
| FAILED | Error occurred, check message |

---

## 🔐 Security Notes

⚠️ **Important:**
- Never commit `.env` file to version control
- Use strong passwords (16+ chars for production)
- Rotate secrets periodically
- Use different values for dev and production
- Enable SSL in production (`SERVER_SSL_ENABLED=true`)

---

## 🚀 Production Build

### Backend
```powershell
cd backend/api
mvn clean package -DskipTests
java -jar target/api-1.0.0-SNAPSHOT.jar
```

### Frontend
```powershell
cd frontend
npm run build
# Deploy dist/file-management-system/ to web server
```

---

## 📞 Support

### When Stuck

1. **Quick Lookup** - This file (Getting Started Guide)
2. **Setup Help** - `docs/setup-and-operations.md`
3. **API Reference** - `docs/backend/apis.md`
4. **Backend Logs** - `backend/api-run.log`
5. **Browser Console** - F12 → Console tab
6. **All Documentation** - `docs/README.md`

### Additional Resources

- [Java 21 Features](https://www.oracle.com/java/technologies/javase/21-relnote.html)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Angular Docs](https://angular.io/docs)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [JWT Introduction](https://jwt.io/introduction)

---

## ✅ Pre-Start Checklist

- [ ] Java 21 installed
- [ ] Maven 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] MySQL 8+ installed/running
- [ ] `.env` file created in `backend/api/`
- [ ] Google OAuth credentials obtained
- [ ] Database created
- [ ] Port 8080 available
- [ ] Port 4200 available
- [ ] All prerequisites verified

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: Complete

👉 **Next Step**: Follow [Quick Start](#quick-start) section above!

