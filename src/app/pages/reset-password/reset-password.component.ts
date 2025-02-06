import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Auth } from '../../interfaces/Auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  user: Auth | null = null;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  resetPassword(): void {
    if (this.form.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const { email, newPassword } = this.form.value;
    console.log("prueba", email, newPassword)

    this.authService.resetPassword(email, newPassword).subscribe({
      next: response => {
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Reset password error:', err);
      }
    })};
  }
