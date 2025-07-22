import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import { CustomInputComponent } from '../../../../shared/components/form-controls';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CustomInputComponent
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.http.post(`${environment.apiUrl}/auth/register`, { name, email, password })
        .subscribe({
          next: () => {
            this.snackBar.open('Registro realizado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/auth/login']);
          },
          error: (error) => {
            this.snackBar.open(
              error.error?.message || 'Erro ao realizar registro',
              'Fechar',
              { duration: 3000 }
            );
          }
        });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control || !control.errors) {
      // Check for form-level errors like password mismatch
      if (fieldName === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
        return 'As senhas não conferem';
      }
      return '';
    }

    if (control.errors['required']) {
      const fieldDisplayNames: any = {
        'name': 'Nome',
        'email': 'Email',
        'password': 'Senha',
        'confirmPassword': 'Confirmação de senha'
      };
      return `${fieldDisplayNames[fieldName]} é obrigatório`;
    }
    if (control.errors['email']) {
      return 'Email inválido';
    }
    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      const fieldDisplayNames: any = {
        'name': 'Nome',
        'password': 'Senha'
      };
      return `${fieldDisplayNames[fieldName]} deve ter no mínimo ${minLength} caracteres`;
    }
    return '';
  }
} 