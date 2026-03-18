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
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    if (this.newName.trim() && this.currentUser) {
      // Save profile image to localStorage
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          localStorage.setItem(`profile_image_${this.currentUser?.id}`, e.target.result);
        };
        reader.readAsDataURL(this.selectedFile);
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
