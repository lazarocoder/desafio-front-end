import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-select-container">
      <label *ngIf="label" [for]="selectId" class="custom-label">{{ label }}</label>
      <select 
        [id]="selectId"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        (change)="onChange($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="custom-select"
        [class.error]="hasError"
        [class.disabled]="disabled"
      >
        <option value="" [disabled]="required" [selected]="!value">
          {{ placeholder || 'Select an option' }}
        </option>
        <option 
          *ngFor="let option of options" 
          [value]="option.value"
          [disabled]="option.disabled"
          [selected]="value === option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div *ngIf="hasError && errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div *ngIf="hint" class="hint-message">
        {{ hint }}
      </div>
    </div>
  `,
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() options: SelectOption[] = [];
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() control: AbstractControl | null = null;

  @Output() valueChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  value: any = '';
  selectId: string = `custom-select-${Math.random().toString(36).substr(2, 9)}`;

  private onChangeCallback = (value: any) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return this.control ? this.control.invalid && (this.control.dirty || this.control.touched) : false;
  }

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChangeCallback(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}