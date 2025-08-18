import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email!: string;
  password!: string;

  private authService = inject(AuthServiceService);
  private snackBar = inject(MatSnackBar)
  private router = inject(Router);

  hide = signal(false);

  login(){
    let formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);

    this.authService.loginUser(formData).subscribe({
      next:() => {
        this.snackBar.open('Logged in successful', 'Close');
      },
      error: (err: HttpErrorResponse) => {
        let error = err.error as ApiResponse<string>;

        this.snackBar.open(error.error, 'Close', {
          duration: 3000,
        });
      },
      complete:() => {
        this.router.navigate(["/"]);
      },
    });
  }

  togglePassword(event: MouseEvent){  //toggle password method
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
