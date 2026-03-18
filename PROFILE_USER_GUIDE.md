# Profile Feature - User Guide

## 🎯 Quick Overview

The Profile feature has been added to your File Management System. It allows users to:
- View and edit their profile information
- Upload and change profile picture
- View comprehensive file statistics

---

## 🚀 How to Use

### Step 1: Access Profile Menu
1. **Login** to the application
2. Look at the **top-right corner** of the navbar
3. You'll see a **circular avatar image** (your profile picture)
4. **Click the avatar** to open the dropdown menu

### Step 2: View Profile
1. In the dropdown menu, click **"View Profile"**
2. You'll be taken to your profile page at `/profile`
3. Your profile information and statistics will be displayed

### Step 3: Edit Profile
1. On the profile page, click **"Edit Profile"** button
2. The page switches to edit mode
3. You can now:
   - **Change Profile Image:** Click "Change Image" button
   - **Update Name:** Edit the name field
   - **Email:** Cannot be changed (read-only)

### Step 4: Save Changes
1. After making changes, click **"Save Changes"** button
2. Your profile is updated immediately
3. Profile picture is stored in your browser
4. The page exits edit mode automatically

### Step 5: View Statistics
1. Below your profile section, you'll see **"Your File Statistics"**
2. Five beautiful cards show:
   - **Total Files** - How many files you've uploaded
   - **Pending** - Files still being processed
   - **Successful** - Files processed successfully
   - **Failed** - Files with processing errors
   - **Success Rate** - Percentage as a progress bar

---

## 📊 Statistics Explained

### Total Files
Shows the total number of files you've uploaded to the system.

### Pending Files (Orange)
Files that are waiting to be processed. They appear here until the backend processes them.

### Successful Files (Green)
Files that have been processed successfully. This is what you want!

### Failed Files (Red)
Files that encountered errors during processing. Check the file details for more info.

### Success Rate (Blue Progress Bar)
Shows what percentage of your files were processed successfully.

**Formula:** (Successful Files / Total Files) × 100

**Example:**
- Total Files: 10
- Successful: 8
- Success Rate: 80%

---

## 💡 Features in Detail

### Profile Image
- **Supported Formats:** PNG, JPG, JPEG, GIF, WebP
- **Storage:** Stored in your browser (localStorage)
- **Persistence:** Image stays even after logout
- **Change Anytime:** Edit and save a new image whenever you want

### Name Update
- **Requirements:** Must not be empty
- **Validation:** Automatically validates on save
- **Display:** Updated everywhere (navbar, profile page)

### File Statistics
- **Real-time:** Updates as you upload new files
- **Auto-refresh:** Refreshes when you view the profile page
- **Calculation:** Based on file status in database

---

## 🎨 What You'll See

### Profile Header (When Not Editing)
```
┌────────────────────────────────────────────┐
│  [Avatar] ╔════════════════════════════╗  │
│           ║ John Doe                   ║  │
│           ║ john@example.com           ║  │
│           ║ [Edit Profile Button]      ║  │
│           ╚════════════════════════════╝  │
└────────────────────────────────────────────┘
```

### Edit Mode
```
┌────────────────────────────────────────────┐
│ EDIT PROFILE                               │
├────────────────────────────────────────────┤
│ [Choose Image] [Change Image Button]       │
├────────────────────────────────────────────┤
│ Name: [____________]                       │
│ Email: john@example.com (disabled)         │
├────────────────────────────────────────────┤
│ [Save Changes]  [Cancel]                   │
└────────────────────────────────────────────┘
```

### Statistics Section
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   10        │  │   2         │  │   8         │  │   0         │
│ Total Files │  │  Pending    │  │ Successful  │  │   Failed    │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

┌──────────────────────────────────────────┐
│ Success Rate: ████████░░ 80%            │
└──────────────────────────────────────────┘
```

---

## ✅ Troubleshooting

### Q: My profile image isn't showing in the navbar
**A:** After uploading an image:
1. Click "Save Changes"
2. Refresh the page (F5)
3. The avatar should appear in the navbar

### Q: I uploaded a new file but statistics didn't update
**A:** 
1. File statistics load when you first visit the profile page
2. Refresh the page to see latest numbers
3. Processing files take time to complete

### Q: I can't upload an image
**A:**
1. Make sure the file is an image (PNG, JPG, etc.)
2. File size should be reasonable (< 5MB)
3. Try a different image file

### Q: My edits didn't save
**A:**
1. Make sure you clicked "Save Changes"
2. Check browser console for errors (F12)
3. Try again or refresh the page

### Q: Profile information disappeared after logout/login
**A:**
- Profile image is stored locally (remains after login)
- Name updates are saved to localStorage
- If lost, you can edit again to save

---

## 🔧 Technical Details

### Where Data is Stored
- **Profile Image:** Browser localStorage (`profile_image_{userId}`)
- **Name:** localStorage in user JSON object (`fl_user`)
- **Statistics:** Calculated from backend file data in real-time

### API Calls
- Profile page calls: `GET /api/file-loads` to fetch file list
- No additional API needed for image storage (client-side only)

### Browser Requirements
- Must support JavaScript
- Must support localStorage
- Modern browser recommended (Chrome, Firefox, Edge, Safari)

---

## 📱 Mobile Experience

The profile page is fully responsive:
- **Desktop:** 4-column grid for statistics
- **Tablet:** 2-column grid
- **Mobile:** Full-width single column
- All features work the same on mobile

---

## 🚀 Future Enhancements

Coming soon:
- ✨ Cloud storage for profile images (backend integration)
- ✨ Advanced analytics and charts
- ✨ Monthly statistics
- ✨ Export profile data
- ✨ Profile bio/description
- ✨ User preferences and themes

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review PROFILE_FEATURE.md for technical details
3. Check browser console (F12) for error messages
4. Contact your administrator

---

**Happy uploading!** 🎉

