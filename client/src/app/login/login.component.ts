import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from "../components/button/button.component";

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule, RouterLink, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email!: string;
  password!: string;

  authService = inject(AuthService);
  private snackBar = inject(MatSnackBar)
  private router = inject(Router);

  hide = signal(false);

  login(){
    this.authService.isLoading.set(true);
    let formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);

    this.authService.loginUser(formData).subscribe({
      next:() => {
        this.authService.me().subscribe();
        this.snackBar.open('Login successful', 'Close', {
          duration: 500,
        });
        this.authService.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        let error = err.error as ApiResponse<string>;

        this.snackBar.open(error.error, 'Close', {
          duration: 1000,
        });
        this.authService.isLoading.set(false);
      },
      complete:() => {
        this.router.navigate(["/"]);
        this.authService.isLoading.set(false);
      },
    });
  }

  togglePassword(event: MouseEvent){  //toggle password method
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
