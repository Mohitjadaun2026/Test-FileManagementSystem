# 📁 TradeNest - File Management System

A modern, full-stack **CSV file management and processing platform** for uploading, managing, and processing CSV files with built-in security and role-based access control.

**Built with**: Java 21 | Spring Boot 3 | Angular 17 | MySQL 8

---

## ⚡ Get Started in 5 Minutes

### Prerequisites
Make sure you have these installed:
- **Java 21+** - [Download](https://www.oracle.com/java/technologies/downloads/#java21)
- **MySQL 8+** - [Download](https://dev.mysql.com/downloads/mysql/) or use Docker
- **Node.js 18+** - [Download](https://nodejs.org/)

### Quick Setup (Copy & Paste)

**Step 1: Configure Environment Variables**

Update `.env` file in `backend/api/` directory:

```powershell
cd backend/api
# Edit .env file and replace all xxxxxx with your actual credentials
# See below for where to get each credential
```

**Where to Get Credentials:**

1. **Database Password** (DB_PASSWORD)
   - Your MySQL password

2. **Google OAuth2 Credentials** (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
   - Get from: https://console.cloud.google.com/
   - Steps: Create project → Enable Google+ API → Create OAuth 2.0 Web credentials

3. **JWT Secret** (JWT_SECRET)
   - Use any strong random string (16+ characters)

4. **Super-Admin Password** (SUPER_ADMIN_PASSWORD)
   - Set your desired password (created on first startup)

5. **Email/Gmail Credentials** (MAIL_SMTP_USERNAME, MAIL_SMTP_PASSWORD)
   - Gmail username: Your Gmail email
   - Gmail app password: Generate at https://myaccount.google.com/apppasswords

6. **SSL Keystore Password** (SERVER_SSL_KEY_STORE_PASSWORD)
   - Your keystore file password

> **See `.env` file or `docs/GETTING_STARTED.md` for complete variable details and setup instructions**

**Step 2: Start MySQL**

```powershell
# Windows
net start MySQL80

# Or use Docker
docker run --name mysql8 -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8
```

**Step 3: Start Backend** (Terminal 1)

```powershell
cd backend/api
mvn spring-boot:run
```

Wait for: `Started ApiApplication in X.XXX seconds`

**Step 4: Start Frontend** (Terminal 2)

```powershell
cd frontend
npm install
npm start
```

Wait for: `✔ Compiled successfully`

**Step 5: Login & Test**

- Open: `https://localhost:4200`
- Email: `superadmin@gmail.com`
- Password: `admin@123` (from `.env`)
- Click "Upload File" to test

✅ **Done!** You're now running TradeNest!

---

## 📚 Complete Documentation

All documentation is in the `docs/` folder. Choose your role:

| Role | Start Here | Time |
|------|-----------|------|
| 👤 **New to Project** | `docs/GETTING_STARTED.md` | 10 min |
| 👨‍💻 **Backend Developer** | `docs/backend/README.md` | 30 min |
| 🎨 **Frontend Developer** | `docs/frontend/README.md` | 30 min |
| 🔧 **DevOps/Operations** | `docs/GETTING_STARTED.md` (Detailed Setup) | 20 min |
| 🔐 **Security Team** | `docs/security/README.md` | 15 min |
| ⚡ **Need Quick Commands** | `docs/GETTING_STARTED.md` (Quick Reference) | 5 min |

### Documentation Files

```
docs/
├── README.md                    ← Documentation Hub
├── GETTING_STARTED.md           ← Setup + Config + Quick Reference (BEST FOR NEW USERS)
├── backend/                     ← Backend architecture & APIs
├── frontend/                    ← Frontend structure & pages
└── security/                    ← Security, auth, permissions
```

---

## ✨ Key Features

### 👤 User Features
- ✅ Local login + Google OAuth2
- ✅ Upload CSV files (max 20MB)
- ✅ Search & filter files
- ✅ Download files
- ✅ Profile management
- ✅ Real-time dashboard

### 🔐 Admin Features
- ✅ Block/unblock users
- ✅ View user files
- ✅ Delete all user files
- ✅ Permission-based access

### 🚀 Super-Admin Features
- ✅ Create admin invites
- ✅ Manage permissions
- ✅ Security controls
- ✅ Audit logs

---

## 🛠️ Quick Commands

```powershell
# From Project Root

# Start Backend
npm run backend

# Start Frontend
npm start

# Stop all: Press Ctrl+C in each terminal
```

---

## 🔗 Application URLs

Once running:

| Service | URL |
|---------|-----|
| **Frontend** | `https://localhost:4200` |
| **Backend API** | `http://localhost:8080` |
| **API Docs** | `http://localhost:8080/swagger-ui.html` |
| **Health Check** | `http://localhost:8080/actuator/health` |

---

## 🐛 Common Issues

### "Port 8080 already in use"
```powershell
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### "Can't connect to MySQL"
```powershell
# Check MySQL is running
mysql -h localhost -u root -p

# Or start Docker container
docker run --name mysql8 -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8
```

### "Login fails with credentials"
- Verify `.env` has correct `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`
- Restart backend after changing `.env`

### "Frontend shows blank page"
- Accept browser certificate warning (normal for localhost SSL)
- Check browser console: F12 → Console tab

**For more issues**: See `docs/GETTING_STARTED.md` → Troubleshooting section

---

## 📁 Project Structure

```
Test-FileManagementSystem/
├── backend/                ← Spring Boot API (Java 21)
│   ├── api/               ← Controllers, config, security
│   ├── service/           ← Business logic
│   ├── dao/               ← Database layer
│   ├── model/             ← Entities & DTOs
│   └── uploads/           ← Uploaded CSV files
├── frontend/              ← Angular 17 app
│   └── src/app/          ← Components, pages, services
├── docs/                  ← Complete documentation
├── csv/                   ← Sample CSV test files
├── package.json           ← Root scripts
└── README.md              ← This file
```

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 17 + Angular Material |
| **Backend** | Spring Boot 3 + Java 21 |
| **Database** | MySQL 8+ |
| **Authentication** | JWT + Google OAuth2 |
| **Build Tools** | Maven + npm |

---

## 🔐 Security Features

- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- JWT token authentication with expiration
- Google OAuth2 integration
- Password reset with token validation
- Permission-scoped admin controls
- CORS and CSRF protection
- Blocked IP management
- Method-level authorization

---

## 💡 Default Credentials

After setup, login with:

```
Email: superadmin@gmail.com
Password: admin@123
```

> Change these in `.env` to your own values

---

## 📖 Where to Go Next

### 🎯 Choose Your Next Step

**I want to...**
- ✅ Upload a CSV file → Just click "Upload File" button
- ✅ Create an admin user → Go to Admin → Admin Invitations
- ✅ Understand the APIs → See `docs/backend/apis.md`
- ✅ Configure production → See `docs/GETTING_STARTED.md`
- ✅ Understand security → See `docs/security/README.md`

### 📚 Full Documentation

**Everything is documented in `docs/GETTING_STARTED.md`:**
- ✅ Complete setup guide
- ✅ Environment configuration
- ✅ All commands & URLs
- ✅ Troubleshooting (20+ issues)
- ✅ Database management
- ✅ Production deployment

---

## 🎯 First-Time Checklist

- [ ] Install Java 21, Node.js, MySQL
- [ ] Create `.env` file in `backend/api/`
- [ ] Start MySQL
- [ ] Run `npm run backend` (Terminal 1)
- [ ] Run `npm start` (Terminal 2)
- [ ] Open `https://localhost:4200`
- [ ] Login with super-admin credentials
- [ ] Upload a test CSV file
- [ ] Try admin features
- [ ] Read `docs/GETTING_STARTED.md` for details

---

## 🚀 What Can You Do

### As Regular User
- Upload CSV files
- View file status (PENDING → PROCESSING → SUCCESS/FAILED)
- Download files
- Delete your files
- Edit profile

### As Admin
- Manage users (block/unblock)
- View user files
- Delete all files of a user
- Different permission scopes available

### As Super-Admin
- Create admin invites
- Manage admin permissions
- View audit logs
- Full system control

---

## 📞 Need Help?

1. **First Time Setup** → `docs/GETTING_STARTED.md` (Quick Start section)
2. **Commands & URLs** → `docs/GETTING_STARTED.md` (Quick Reference section)
3. **Configuration** → `docs/GETTING_STARTED.md` (Environment Setup section)
4. **Troubleshooting** → `docs/GETTING_STARTED.md` (Troubleshooting section)
5. **API Reference** → `docs/backend/apis.md`
6. **All Docs Hub** → `docs/README.md`

---

## 🔍 Key Files You'll Need

| File | Purpose |
|------|---------|
| `.env` | Configuration (create in `backend/api/`) |
| `backend/api-run.log` | Backend logs if errors occur |
| `docs/GETTING_STARTED.md` | Complete beginner guide |
| `docs/README.md` | Documentation navigation hub |

---

## ✨ Features Highlights

### File Processing
- Upload CSV files (max 20MB)
- Automatic async processing
- Real-time status updates
- Error tracking

### User Management
- User registration
- Email-based password reset
- Profile image upload
- User blocking/unblocking

### Admin Controls
- Scope-based permissions
- Invite-based admin creation
- User file management
- System audit logs

---

## 🎓 Learning Resources

- [Java 21 Documentation](https://www.oracle.com/java/technologies/javase/21-relnote.html)
- [Spring Boot Guide](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [MySQL Guide](https://dev.mysql.com/doc/)

---

## 📝 Notes

- Browser might warn about self-signed certificate on localhost - this is normal, click "Advanced" and proceed
- Database auto-creates on first startup
- Files are stored in `backend/uploads/` directory
- MySQL auto-increment continues after file deletion (this is normal)

---

## 💬 Support & Issues

- Check `docs/GETTING_STARTED.md` for troubleshooting
- Review backend logs: `backend/api-run.log`
- Check browser console: F12 key
- Read API documentation: `docs/backend/apis.md`

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: Production Ready  
**License**: MIT

---

## 👉 Next Steps

1. **Follow the Quick Setup above** (5 minutes)
2. **Open `docs/GETTING_STARTED.md`** for complete guide
3. **Start building!** 🚀

**Questions?** Everything is documented in `docs/` folder!
