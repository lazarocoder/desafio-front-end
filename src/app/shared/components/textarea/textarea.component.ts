import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="textarea-container" [class.has-error]="hasError">
      <label *ngIf="label" [for]="id" class="textarea-label">{{ label }}</label>
      <textarea
        [id]="id"
        [formControl]="control"
        [placeholder]="placeholder"
        [rows]="rows"
        class="textarea-field"
        [class.error]="hasError"
        (blur)="onTouched()"
      ></textarea>
      <span *ngIf="hasError" class="error-message">{{ errorMessage }}</span>
    </div>
  `,
  styles: [`
    .textarea-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }

    .textarea-label {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }

    .textarea-field {
      padding: 0.5rem 0.75rem;
      border: 1px solid #D1D5DB;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
      resize: vertical;
      min-height: 100px;
    }

    .textarea-field:focus {
      outline: none;
      border-color: #2563EB;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }

    .textarea-field.error {
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
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() id = `textarea-${Math.random().toString(36).substr(2, 9)}`;

  control = new FormControl('');
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  get hasError(): boolean {
    return this.control.invalid && this.control.touched;
  }

  get errorMessage(): string {
    if (!this.hasError) return '';
    
    const errors = this.control.errors;
    if (!errors) return '';

    if (errors['required']) return 'Este campo é obrigatório';
    if (errors['maxlength']) return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    
    return 'Campo inválido';
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
} 