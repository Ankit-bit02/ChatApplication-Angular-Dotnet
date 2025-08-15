import { Component, inject, signal } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email!: string;
  password!: string;
  fullName!: string;
  profilePicture: string = 'https://randomuser.me/api/portraits/men/25.jpg';
  profileImage: File | null = null;

  authService = inject(AuthServiceService);
  hide = signal(true);

  togglePassword(event: MouseEvent){
    this.hide.set(!this.hide)
  }
}
