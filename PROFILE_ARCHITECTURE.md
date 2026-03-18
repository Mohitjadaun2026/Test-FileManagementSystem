# Profile Feature - Architecture & Visual Guide

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FILE MANAGEMENT SYSTEM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────┐      │
│  │   NAVBAR COMPONENT   │         │  PROFILE DROPDOWN    │      │
│  │   ──────────────────  │────────▶│  ──────────────────  │      │
│  │ Dashboard|Files|Up   │         │ User Name            │      │
│  │ [Avatar] ◄──┐        │         │ User Email           │      │
│  └──────────────│───────┘         │ View Profile         │      │
│                 │                 │ Logout               │      │
│                 │                 └──────────────────────┘      │
│                 │                                                │
│                 └───────────────────┐                           │
│                                     ▼                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            PROFILE PAGE (/profile)                      │   │
│  │  ───────────────────────────────────────────────────────│   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ PROFILE HEADER                                   │   │   │
│  │  │ ┌─────┐  John Doe                                │   │   │
│  │  │ │[IMG]│  john@example.com                        │   │   │
│  │  │ └─────┘  [Edit Profile]                          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ FILE STATISTICS                                  │   │   │
│  │  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │   │   │
│  │  │ │ 10   │ │  2   │ │  8   │ │  0   │             │   │   │
│  │  │ │Total │ │Pend  │ │Succ  │ │Fail  │             │   │   │
│  │  │ └──────┘ └──────┘ └──────┘ └──────┘             │   │   │
│  │  │ ┌────────────────────────────────────────┐       │   │   │
│  │  │ │ Success: ████████░░ 80%                │       │   │   │
│  │  │ └────────────────────────────────────────┘       │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │     SERVICES (Angular Services)                         │   │
│  │  ──────────────────────────────────────────────────────│   │
│  │  • AuthService → Get current user, manage login/logout│   │
│  │  • FileLoadService → Fetch file list & statistics    │   │
│  │  • localStorage → Persist profile image & name       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │     BACKEND API (Spring Boot)                           │   │
│  │  ──────────────────────────────────────────────────────│   │
│  │  • GET /api/file-loads → Fetch all user files         │   │
│  │  • GET /api/file-loads/{id} → Fetch file details     │   │
│  │  • Auth endpoints → User validation                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │     DATABASE (MySQL)                                    │   │
│  │  ──────────────────────────────────────────────────────│   │
│  │  • users table → User account info                     │   │
│  │  • file_loads table → File metadata & status          │   │
│  │  • file_load_errors table → Processing errors        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

### Profile Image Upload & Storage

```
User (Browser)
    │
    │ 1. Click "Change Image"
    ▼
File Input Dialog
    │
    │ 2. Select image file
    ▼
ProfileComponent.onFileSelected()
    │
    │ 3. Validate image type
    │ 4. Create FileReader
    ▼
Convert to Base64
    │
    │ 5. Update profileImage variable
    │ 6. Display preview
    ▼
User Reviews Preview
    │
    │ 7. Click "Save Changes"
    ▼
ProfileComponent.saveProfile()
    │
    │ 8. Read Base64 image
    ▼
localStorage.setItem()
    │
    │ 9. Key: profile_image_{userId}
    ▼
Success Message
    │
    │ 10. Display in navbar
    │ 11. Display in profile page
    ▼
✅ Image Persisted
```

### File Statistics Calculation

```
ProfileComponent.ngOnInit()
    │
    │ 1. Get current user from AuthService
    ▼
Call FileLoadService.list(criteria)
    │
    │ 2. HTTP GET /api/file-loads
    │ 3. Backend returns all user files
    ▼
Backend (Spring Boot)
    │
    │ 4. Query database for files
    │ 5. Filter by user
    │ 6. Apply search criteria
    ▼
Return FileItem[]
    │
    │ 7. Receive response
    ▼
Calculate Statistics
    │
    ├─ totalFiles = array.length
    ├─ pendingFiles = filter(status='PENDING')
    ├─ successFiles = filter(status='SUCCESS')
    ├─ failedFiles = filter(status='FAILED')
    └─ successRate = (successFiles/totalFiles) × 100
    │
    ▼
Update Component Properties
    │
    ▼
Display in Statistics Cards
    │
    │ 8. Render numbers in UI
    │ 9. Show progress bar
    │ 10. Color-code by status
    ▼
✅ Statistics Updated
```

---

## 🎯 Component Hierarchy

```
AppComponent
    │
    ├─ NavbarComponent (Top Navigation)
    │   │
    │   ├─ Profile Avatar Button
    │   │   └─ MatMenu (Dropdown)
    │   │       ├─ Profile Header Section
    │   │       │   ├─ Avatar Image
    │   │       │   ├─ Username
    │   │       │   └─ Email
    │   │       ├─ MatDivider
    │   │       ├─ View Profile Menu Item
    │   │       └─ Logout Menu Item
    │   │
    │   └─ Other navbar buttons (Files, Upload, etc.)
    │
    ├─ Router Outlet
    │   │
    │   └─ ProfileComponent (When /profile route)
    │       │
    │       ├─ Profile Header Section
    │       │   ├─ Avatar Image
    │       │   ├─ User Name
    │       │   ├─ User Email
    │       │   └─ Edit Profile Button
    │       │
    │       ├─ Profile Edit Section (Conditional)
    │       │   ├─ Image Upload Input
    │       │   ├─ Name Form Field
    │       │   ├─ Email Form Field (disabled)
    │       │   ├─ Save Changes Button
    │       │   └─ Cancel Button
    │       │
    │       └─ Statistics Section
    │           ├─ Stats Grid Container
    │           ├─ Total Files Card
    │           ├─ Pending Files Card
    │           ├─ Successful Files Card
    │           ├─ Failed Files Card
    │           └─ Success Rate Card (Progress Bar)
    │
    └─ FooterComponent
```

---

## 🔌 Service Integration

```
┌─────────────────────────────────────────┐
│        ProfileComponent                 │
└─────────────────────────────────────────┘
           │                    │
           │                    │
    ┌──────▼──────┐      ┌──────▼──────┐
    │ AuthService │      │ FileLoadSvc │
    └──────┬──────┘      └──────┬──────┘
           │                    │
    ┌──────▼──────┐      ┌──────▼──────┐
    │ currentUser$│      │list(criteria)
    │localStorage │      │Observable   │
    └──────┬──────┘      └──────┬──────┘
           │                    │
    ┌──────▼──────────────────▼──┐
    │   HTTP Requests to Backend  │
    │   (Authorization Headers)   │
    └──────┬──────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │   Spring Boot API (8080)    │
    │   /api/auth endpoints       │
    │   /api/file-loads endpoints │
    └──────┬──────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │   MySQL Database            │
    │   users table               │
    │   file_loads table          │
    │   file_load_errors table    │
    └─────────────────────────────┘
```

---

## 📱 UI Layout Breakdown

### Desktop Layout (1200px+)

```
┌────────────────────────────────────────────────────────┐
│ Logo  Dashboard  Files  Upload     [Avatar] ▼           │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Profile Header (Gradient Background)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Avatar] John Doe                                │  │
│  │          john@example.com                        │  │
│  │          [Edit Profile]                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Your File Statistics                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──┐ │
│  │   10        │ │    2        │ │     8       │ │ 0│ │
│  │ Total Files │ │   Pending   │ │  Successful │ │F │ │
│  │             │ │             │ │             │ │a │ │
│  │             │ │   (Orange)  │ │   (Green)   │ │i │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │l │ │
│                                                    │e │ │
│  ┌──────────────────────────────────────────┐    │d │ │
│  │ Success Rate: ████████░░ 80%             │    └──┘ │
│  └──────────────────────────────────────────┘         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px - 1199px)

```
┌────────────────────────────────┐
│ Logo      Files  Upload [Avatar]│
├────────────────────────────────┤
│   Profile Header               │
│   ┌────────────────────────┐   │
│   │ [Avatar] John Doe      │   │
│   │ john@example.com       │   │
│   │ [Edit Profile]         │   │
│   └────────────────────────┘   │
│                                │
│   Your File Statistics         │
│   ┌──────────┐ ┌──────────┐   │
│   │  10      │ │   2      │   │
│   │ Total    │ │ Pending  │   │
│   └──────────┘ └──────────┘   │
│                                │
│   ┌──────────┐ ┌──────────┐   │
│   │  8       │ │   0      │   │
│   │Successful│ │  Failed  │   │
│   └──────────┘ └──────────┘   │
│                                │
│   ┌────────────────────────┐   │
│   │ Success: ████░░ 80%    │   │
│   └────────────────────────┘   │
└────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌──────────────────────┐
│ Logo      [Avatar] ▼ │
├──────────────────────┤
│ Profile Header       │
│ ┌──────────────────┐ │
│ │    [Avatar]      │ │
│ │ John Doe         │ │
│ │john@example.com  │ │
│ │ [Edit Profile]   │ │
│ └──────────────────┘ │
│                      │
│ File Statistics      │
│ ┌──────────────────┐ │
│ │    10            │ │
│ │ Total Files      │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │    2             │ │
│ │   Pending        │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │    8             │ │
│ │  Successful      │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │    0             │ │
│ │    Failed        │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ Success: ████░░  │ │
│ │        80%       │ │
│ └──────────────────┘ │
└──────────────────────┘
```

---

## 🎨 Color Scheme

```
Primary Colors (Gradient):
  #667eea (Purple-Blue)
  #764ba2 (Purple)

Status Colors:
  Total:      #667eea (Blue)
  Pending:    #ff9800 (Orange)
  Success:    #4caf50 (Green)
  Failed:     #f44336 (Red)
  Progress:   #667eea (Blue)

Background:
  Light:      #f5f5f5 (Light Gray)
  White:      #ffffff (White)
  Dark:       #333333 (Dark Gray)

Text:
  Primary:    #333333 (Dark Gray)
  Secondary:  #999999 (Medium Gray)
  Light:      #ffffff (White)
```

---

## 📊 Statistics Card Layout

### Individual Card
```
┌─────────────────────┐
│  ████████░░ 80%     │  (Success Rate Only)
│                     │
│       10            │  (Stat Value)
│   Total Files       │  (Stat Label)
└─────────────────────┘
```

### Grid Arrangements
**Desktop (4 columns):**
```
[Total] [Pending] [Success] [Failed]
[────────── Success Rate ──────────]
```

**Tablet (2 columns):**
```
[Total]    [Pending]
[Success]  [Failed]
[──── Success Rate ────]
```

**Mobile (1 column):**
```
[Total]
[Pending]
[Success]
[Failed]
[Success Rate]
```

---

## 🔐 Security Architecture

```
┌────────────────────────────────────────────┐
│         Authentication Flow                │
├────────────────────────────────────────────┤
│                                            │
│  1. User Login                             │
│     ├─ Email + Password                    │
│     └─ POST /api/auth/login                │
│                                            │
│  2. Backend Validates                      │
│     ├─ Check credentials                   │
│     └─ Generate JWT token                  │
│                                            │
│  3. Store Token                            │
│     ├─ localStorage.setItem('fl_user')     │
│     └─ Token in User object                │
│                                            │
│  4. API Requests                           │
│     ├─ Include Authorization header        │
│     └─ Bearer {JWT_TOKEN}                  │
│                                            │
│  5. Protected Routes                       │
│     ├─ AuthGuard checks token              │
│     └─ Allow/Deny access                   │
│                                            │
│  6. Profile Page                           │
│     ├─ Requires authentication             │
│     ├─ Shows only own data                 │
│     └─ API validates token                 │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

```
Development Machine
  │
  └─ npm run frontend
     └─ Angular Dev Server (localhost:4200)
        └─ Connects to Backend (localhost:8080)

Production Server
  │
  ├─ Frontend (Angular Build)
  │  └─ npm run build
  │     └─ dist/file-load-ui/
  │        └─ Hosted on Web Server (Nginx, Apache)
  │
  ├─ Backend (Spring Boot)
  │  └─ mvn package
  │     └─ api-1.0.0-SNAPSHOT.jar
  │        └─ Runs on App Server (Tomcat)
  │           │
  │           └─ Connects to Database
  │
  └─ Database (MySQL)
     └─ users table
     └─ file_loads table
     └─ file_load_errors table
```

---

## 📈 Performance Considerations

```
Component Load Time:
  ┌─────────────────────────────────────┐
  │ Page Load (ms)                      │
  ├─────────────────────────────────────┤
  │ Component Init          50-100 ms   │
  │ Load Profile Image      ~0 ms       │
  │ Fetch Statistics        200-500 ms  │
  │ Render UI               50-100 ms   │
  ├─────────────────────────────────────┤
  │ Total Time:             300-700 ms  │
  └─────────────────────────────────────┘

Storage Capacity:
  ┌─────────────────────────────────────┐
  │ localStorage Limit:    5-10 MB      │
  │ Profile Image Size:    50-200 KB    │
  │ User Object:           ~1 KB        │
  │ Remaining:             ~5 MB        │
  └─────────────────────────────────────┘
```

---

## ✨ Summary

This comprehensive architecture provides:
- ✅ Clean separation of concerns
- ✅ Scalable component structure
- ✅ Secure authentication flow
- ✅ Responsive design for all devices
- ✅ Real-time data fetching
- ✅ Client-side image storage
- ✅ Material Design aesthetic

---

**Visual Guide Version:** 1.0  
**Created:** March 2026  
**Status:** Complete & Visual

