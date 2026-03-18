# Frontend - File Management System

Angular web application for the File Management System. This is a user-facing interface for uploading, tracking, and managing files.

---

## 📋 Prerequisites

Before running the frontend, ensure you have:

- **Node.js 18+** (npm included)
- **Angular 17**
- **Git** (optional, for cloning)

### ✅ Verify Installation

```powershell
node -v
npm -v
```

Both commands should show version numbers.

---

## 🚀 Quick Start

### Step 1: Install Dependencies

Navigate to the frontend folder and install all required packages:

```powershell
cd frontend
npm install
```

This will install:
- Angular framework and CLI
- Angular Material UI components
- RxJS (reactive programming library)
- All other dependencies listed in `package.json`

**Time:** ~2-3 minutes on first run

### Step 2: Start Development Server

Run the Angular development server:

```powershell
npm start
```

Or use the alternative command:

```powershell
npm run frontend
```

Both commands do the same thing: `ng serve --no-open`

### Step 3: Open in Browser

Once you see the message:
```
Local: http://localhost:4200/
```

Open your browser and go to:
```
http://localhost:4200
```

The app will automatically reload when you make code changes.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/        # UI components (login, upload, file-list, etc.)
│   │   ├── services/          # API calls and authentication logic
│   │   ├── guards/            # Route protection (auth guard)
│   │   ├── models/            # TypeScript interfaces (User, FileLoad, etc.)
│   │   ├── app.module.ts      # Root module with all dependencies
│   │   └── app-routing.module.ts
│   ├── environments/          # Environment configuration
│   │   ├── environment.ts     # Development config
│   │   └── environment.prod.ts # Production config
│   ├── styles.scss            # Global styles
│   └── index.html             # HTML entry point
├── angular.json               # Angular CLI configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Node dependencies
└── README.md                  # This file
```

---

## ⚙️ Configuration

### API Endpoint

The frontend communicates with the backend API. Configure the API URL in:

**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

**Important:** Make sure the backend is running on port 8080 (or change this URL accordingly).

For production builds, use:

**File:** `src/environments/environment.prod.ts`

---

## 📦 Available Commands

```powershell
# Start development server (http://localhost:4200)
npm start

# Start with auto-open browser
npm run start:open

# Build for production
npm run build

# Run production build locally
npm run prod

# Run Angular CLI commands directly
ng generate component components/my-component
ng generate service services/my-service
```

---

## 🔗 Key Pages and Features

| Feature | URL | Description |
|---------|-----|-------------|
| Login | `/` | User authentication |
| Register | `/register` | Create new account |
| Dashboard | `/dashboard` | Main dashboard |
| Upload File | `/file-upload` | Upload CSV files |
| File List | `/file-list` | View all uploaded files |
| File Search | `/file-search` | Search and filter files |
| File Details | `/file-details/:id` | View file metadata |
| Status Update | `/status-update` | View processing status |

---

## 🔐 Authentication

The app uses **JWT (JSON Web Token)** for authentication:

1. User logs in with credentials
2. Backend returns a JWT token
3. Token is stored in browser localStorage
4. Token is sent with every API request via `Authorization: Bearer <token>`
5. Routes are protected by `AuthGuard` (redirects to login if not authenticated)

**Auth files:**
- `src/services/auth.service.ts` - Login/Register/Logout logic
- `src/services/auth.interceptor.ts` - Adds JWT token to requests
- `src/guards/auth.guard.ts` - Route protection

---

## 🎨 UI Components

The frontend uses **Angular Material** for styling and UI components:

- **Toolbar** - Navigation bar
- **Buttons, Forms, Input Fields** - User interaction
- **Data Table** - File list with sorting/pagination
- **Cards** - File details display
- **Snackbar** - Success/error notifications
- **Dialog** - Confirmation modals

---

## 🐛 Troubleshooting

### Issue: `ng: command not found`

**Solution:** Angular CLI is not globally installed. Use:

```powershell
npx ng serve --no-open
```

Or reinstall dependencies:

```powershell
npm install
```

### Issue: Port 4200 already in use

**Solution:** Kill the process on port 4200:

```powershell
# Windows PowerShell
Get-NetTCPConnection -LocalPort 4200 -State Listen -ErrorAction SilentlyContinue |
Select-Object -ExpandProperty OwningProcess -Unique |
ForEach-Object { Stop-Process -Id $_ -Force }
```

Or run on a different port:

```powershell
ng serve --port 4201
```

### Issue: "Cannot find module '@angular/material'"

**Solution:** Install dependencies:

```powershell
npm install
```

### Issue: "API request fails / 404 errors"

**Solution:** Verify:

1. Backend is running: `http://localhost:8080/api/health`
2. API URL in `src/environments/environment.ts` is correct
3. Browser DevTools → Network tab shows request details

### Issue: Build fails with TypeScript errors

**Solution:** Check TypeScript strict mode in `tsconfig.json`:

```powershell
npm run build
```

Fix any reported type errors or suppress with `// @ts-ignore` if necessary.

---

## 📝 Development Workflow

### Create a New Component

```powershell
ng generate component components/my-new-component
```

This creates:
- `my-new-component.component.ts` - Component logic
- `my-new-component.component.html` - Template
- `my-new-component.component.scss` - Styles
- `my-new-component.component.spec.ts` - Unit tests

### Create a New Service

```powershell
ng generate service services/my-new-service
```

### Run Tests

```powershell
ng test
```

---

## 🚢 Production Build

Build optimized production bundle:

```powershell
npm run build
```

Output will be in `dist/file-load-ui/`

**To run production build locally:**

```powershell
npm run prod
```

---

## 📱 Browser Support

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Create a Pull Request

---

## ⚠️ Important Notes

- **Always** keep the backend running while testing frontend features
- Backend API should be on `http://localhost:8080/api`
- Restart frontend server after changing `environment.ts`
- Clear browser cache if you see stale data (Ctrl+Shift+Delete)
- Use browser DevTools for debugging (F12)

---

## 📞 Support

If you encounter issues:

1. Check this README's Troubleshooting section
2. Verify backend is running and accessible
3. Check browser console for errors (F12 → Console)
4. Check backend logs for API errors
5. Ensure all dependencies are installed: `npm install`

---

**Happy coding!** 🚀

