import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="input-container" [class.has-error]="hasError">
      <label *ngIf="label" [for]="id" class="input-label">{{ label }}</label>
      <input
        [type]="type"
        [id]="id"
        [formControl]="control"
        [placeholder]="placeholder"
        class="input-field"
        [class.error]="hasError"
        (blur)="onTouched()"
      />
      <span *ngIf="hasError" class="error-message">{{ errorMessage }}</span>
    </div>
  `,
  styles: [`
    .input-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      margin-bottom: 1rem;
    }

    .input-label {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }

    .input-field {
      padding: 0.5rem 0.75rem;
      border: 1px solid #D1D5DB;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .input-field:focus {
      outline: none;
      border-color: #2563EB;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }

    .input-field.error {
      border-color: #DC2626;
    }

    .error-message {
      color: #DC2626;
      font-size: 0.75rem;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label?: string;
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;

  control = new FormControl('');
  private onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};
  private subscription?: Subscription;
  ngControl?: NgControl;

  constructor() {}

  ngOnInit() {
    this.subscription = this.control.valueChanges.subscribe(value => {
      this.onChange(value);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get hasError(): boolean {
    return this.control.invalid && this.control.touched;
  }

  get errorMessage(): string {
    if (!this.hasError) return '';
    
    const errors = this.control.errors;
    if (!errors) return '';

    if (errors['required']) return 'Este campo é obrigatório';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    
    return 'Campo inválido';
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
} 