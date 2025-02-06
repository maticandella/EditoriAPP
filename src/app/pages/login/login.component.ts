import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Auth } from '../../interfaces/Auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  user: Auth | null = null;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  login(): void {
    if (this.form.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: response => {
        this.user = response.data;
        this.router.navigate(['/admin']);
      },
      error: err => {
        console.error('Login error:', err);
      }
    });
  }
}
