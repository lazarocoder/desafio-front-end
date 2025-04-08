import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="select-container" [class.has-error]="hasError">
      <label *ngIf="label" [for]="id" class="select-label">{{ label }}</label>
      <select
        [id]="id"
        [formControl]="control"
        class="select-field"
        [class.error]="hasError"
        (blur)="onTouched()"
      >
        <option value="" disabled selected>Selecione uma opção</option>
        <option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
      <span *ngIf="hasError" class="error-message">{{ errorMessage }}</span>
    </div>
  `,
  styles: [`
    .select-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }

    .select-label {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }

    .select-field {
      padding: 0.5rem 0.75rem;
      border: 1px solid #D1D5DB;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
      background-color: white;
      cursor: pointer;
    }

    .select-field:focus {
      outline: none;
      border-color: #2563EB;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }

    .select-field.error {
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
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() options: SelectOption[] = [];
  @Input() id = `select-${Math.random().toString(36).substr(2, 9)}`;

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