# Profile Feature Documentation

## Overview

The Profile feature allows users to:
- View their profile information
- Change profile picture
- Update their name
- View file statistics and upload history

---

## 🎯 Features

### 1. Profile Menu (Right Corner)
- **Location:** Top-right navbar
- **Display:** User's profile avatar (circular image)
- **On Click:** Shows dropdown menu with:
  - User name and email
  - "View Profile" button
  - "Logout" button

### 2. Profile Page
**URL:** `/profile`  
**Access:** Only logged-in users (protected by AuthGuard)

#### Profile Section
- Display profile picture
- Show user name and email
- Edit Profile button to modify:
  - Profile picture (image upload)
  - Name (text input)

#### File Statistics Dashboard
Shows beautiful cards with:
- **Total Files** - Total number of files uploaded
- **Pending** - Files currently processing
- **Successful** - Files processed successfully
- **Failed** - Files that failed processing
- **Success Rate** - Percentage of successful files with progress bar

---

## 📋 Component Structure

```
frontend/src/app/components/profile/
├── profile.component.ts       # Component logic
├── profile.component.html     # Template
└── profile.component.scss     # Styling
```

### Files Modified:
- `app.module.ts` - Added ProfileComponent & Material modules
- `app-routing.module.ts` - Added profile route
- `navbar.component.ts` - Added profile menu logic
- `navbar.component.html` - Added profile dropdown menu
- `navbar.component.scss` - Added profile styling

---

## 🛠️ How It Works

### Profile Avatar Upload
1. Click "Edit Profile"
2. Click "Change Image" button
3. Select an image file (PNG, JPG, etc.)
4. Image preview updates immediately
5. Click "Save Changes" to store

### Storage
- **Profile Image:** Stored in browser's localStorage as Base64
- **Key Format:** `profile_image_{userId}`
- **User Info:** Updated in localStorage `fl_user` JSON

### File Statistics
- **Data Source:** FileLoadService.getFiles()
- **Calculation:**
  - Total = all files
  - Pending = files with status 'PENDING'
  - Success = files with status 'SUCCESS'
  - Failed = files with status 'FAILED'
  - Success Rate = (successFiles / totalFiles) * 100

---

## 🎨 UI/UX Design

### Profile Header
- Gradient background (purple)
- Large circular profile image
- User info displayed
- Edit button with icon

### Edit Mode
- Image upload section
- Name input field
- Email display (read-only)
- Save/Cancel buttons

### Statistics Cards
- Responsive grid layout
- Color-coded values:
  - Total: Blue
  - Pending: Orange
  - Success: Green
  - Failed: Red
- Hover effect (lift animation)
- Mobile responsive

---

## 🔄 Data Flow

```
User Login
   ↓
User stored in localStorage
   ↓
Profile Component loads
   ↓
Load profile image from localStorage
   ↓
Fetch file statistics from backend
   ↓
Display all information
   ↓
User can edit and save changes
```

---

## 🔐 Security Considerations

1. **Local Storage:** Profile images stored locally (client-side only)
2. **Protected Route:** Profile page requires authentication
3. **No Backend Upload:** Currently images stored in localStorage
   - For production, implement backend image upload API

---

## 📱 Responsive Design

- **Desktop:** 4-column grid for stats
- **Tablet (768px):** 2-column grid
- **Mobile (480px):** 1-column full-width

---

## 🚀 Future Enhancements

1. **Backend Integration**
   - POST endpoint to upload profile image to server
   - PUT endpoint to update user name
   - GET endpoint to fetch file statistics

2. **Advanced Statistics**
   - File size statistics
   - Upload date range filter
   - Charts and graphs (Chart.js)
   - Export statistics to PDF

3. **Profile Customization**
   - Bio/About section
   - User preferences
   - Theme selection

4. **File Details**
   - Detailed file history
   - Download count
   - Most recent uploads
   - File type breakdown (pie chart)

---

## 🧪 Testing Checklist

- [ ] Profile menu appears in navbar when logged in
- [ ] Profile avatar displays in navbar
- [ ] Click profile avatar shows dropdown menu
- [ ] "View Profile" button navigates to profile page
- [ ] Profile page shows user info
- [ ] Edit button enables edit mode
- [ ] Image upload works
- [ ] Name can be edited
- [ ] Save changes updates profile
- [ ] File statistics load correctly
- [ ] Statistics update when new files uploaded
- [ ] Responsive design works on mobile
- [ ] Logout button in dropdown works

---

## 💡 Code Examples

### Access Profile Component
```typescript
// In any component
this.router.navigate(['/profile']);
```

### Get Current User
```typescript
this.auth.currentUser$.subscribe(user => {
  console.log(user);
});
```

### Get File Statistics
```typescript
this.fileService.getFiles().subscribe(files => {
  const successCount = files.filter(f => f.status === 'SUCCESS').length;
});
```

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Ready for Use

