import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FileLoadService } from '../../services/file-load.service';
import { User } from '../../models/user.model';
import { SearchCriteria } from '../../models/search-criteria.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isEditing = false;
  newName: string = '';
  profileImage: string = 'assets/default-avatar.svg';
  selectedFile: File | null = null;

  // Statistics
  totalFiles = 0;
  pendingFiles = 0;
  successFiles = 0;
  failedFiles = 0;
  successRate = 0;

  constructor(
    private auth: AuthService,
    private fileService: FileLoadService
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user || null;
      if (user) {
        this.newName = user.name || user.username || '';
        this.loadProfileImage();
        this.loadFileStatistics();
      }
    });
  }

  loadProfileImage(): void {
    // Check if user has a profile image stored
    const storedImage = localStorage.getItem(`profile_image_${this.currentUser?.id}`);
    if (storedImage) {
      this.profileImage = storedImage;
    }
  }

  loadFileStatistics(): void {
    // Fetch all files with default criteria
    const criteria: SearchCriteria = {
      page: 0,
      size: 1000  // Get all files (adjust if needed)
    };

    this.fileService.list(criteria).subscribe(
      (result) => {
        const files = result.items;
        this.totalFiles = files.length;
        this.pendingFiles = files.filter(f => f.status === 'PENDING').length;
        this.successFiles = files.filter(f => f.status === 'SUCCESS').length;
        this.failedFiles = files.filter(f => f.status === 'FAILED').length;

        this.successRate = this.totalFiles > 0
          ? Math.round((this.successFiles / this.totalFiles) * 100)
          : 0;
      },
      (error) => {
        console.error('Error loading file statistics:', error);
      }
    );
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.newName = this.currentUser?.name || this.currentUser?.username || '';
    this.selectedFile = null;
  }

 onFileSelected(event: any): void {
   const file: File = event.target.files[0];

   if (!file || !file.type.startsWith('image/')) {
     alert('Please select a valid image file');
     return;
   }

   // Limit size (optional but recommended)
   if (file.size > 2 * 1024 * 1024) {
     alert('Image should be less than 2MB');
     return;
   }

   this.selectedFile = file;

   const img = new Image();
   const reader = new FileReader();

   reader.onload = (e: any) => {
     img.src = e.target.result;
   };

   img.onload = () => {
     const canvas = document.createElement('canvas');

     const MAX_SIZE = 300; // 🔥 FIX SIZE (profile perfect size)
     let width = img.width;
     let height = img.height;

     // Maintain aspect ratio
     if (width > height) {
       if (width > MAX_SIZE) {
         height *= MAX_SIZE / width;
         width = MAX_SIZE;
       }
     } else {
       if (height > MAX_SIZE) {
         width *= MAX_SIZE / height;
         height = MAX_SIZE;
       }
     }

     canvas.width = width;
     canvas.height = height;

     const ctx = canvas.getContext('2d');
     ctx?.drawImage(img, 0, 0, width, height);

     // Convert to compressed base64
     const compressedImage = canvas.toDataURL('image/jpeg', 0.7);

     // 🔥 Set preview (smooth & controlled size)
     this.profileImage = compressedImage;
   };

   reader.readAsDataURL(file);
 }

  saveProfile(): void {
    if (this.newName.trim() && this.currentUser) {
      // Save profile image to localStorage
     if (this.selectedFile) {
       localStorage.setItem(
         `profile_image_${this.currentUser?.id}`,
         this.profileImage // ✅ use compressed image instead
       );
     }

      // Update user name in localStorage
      if (this.currentUser) {
        this.currentUser.name = this.newName;
        localStorage.setItem('fl_user', JSON.stringify(this.currentUser));
      }

      this.isEditing = false;
      alert('Profile updated successfully!');
    }
  }
}
