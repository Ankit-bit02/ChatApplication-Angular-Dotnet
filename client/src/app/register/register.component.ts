import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { ButtonComponent } from "../components/button/button.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule, RouterLink, ButtonComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email!: string;
  password!: string;
  fullName!: string;
  userName!: string;
  profilePicture: string = 'https://randomuser.me/api/portraits/men/25.jpg';
  profileImage: File | null = null;

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  hide = signal(false); // aslo used for the toggle password

  togglePassword(event: MouseEvent){  //toggle password method for user registration
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  register(){
    this.authService.isLoading.set(true);
    let formData = new FormData();
    formData.append('email', this.email);
    formData.append('fullName', this.fullName);
    formData.append('userName', this.userName);
    formData.append('password', this.password);
    formData.append('profileImage', this.profileImage!);

    this.authService.register(formData).subscribe({
      next: () =>{
        this.snackBar.open('User registered successfully', 'Close', {
          duration: 500,
        });
        this.authService.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error, 'Close');
        this.authService.isLoading.set(false);
      },
      complete: () => {
        this.router.navigate(['/']);
        this.authService.isLoading.set(false);
      },
    });
  }

  onFileSelected(event: any){
    const file:File = event.target.files[0];
    if(file){
    this.profileImage = file;

    const reader = new FileReader();
    reader.onload=(e) =>{
      this.profilePicture = e.target!.result as string;
      console.log(e.target?.result);
    };
    reader.readAsDataURL(file);
    console.log(this.profilePicture);
    }
  }
}
