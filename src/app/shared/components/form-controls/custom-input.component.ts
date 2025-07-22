import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-input-container">
      <label *ngIf="label" [for]="inputId" class="custom-label">{{ label }}</label>
      <input 
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [readonly]="readonly"
        [attr.maxlength]="maxLength"
        [min]="min"
        [max]="max"
        [step]="step"
        [required]="required"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="custom-input"
        [class.error]="hasError"
        [class.disabled]="disabled"
      />
      <div *ngIf="hasError && errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div *ngIf="hint" class="hint-message">
        {{ hint }}
      </div>
    </div>
  `,
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() maxLength: number | null = null;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step: number | null = null;
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() control: AbstractControl | null = null;

  @Output() valueChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  value: any = '';
  inputId: string = `custom-input-${Math.random().toString(36).substr(2, 9)}`;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return this.control ? this.control.invalid && (this.control.dirty || this.control.touched) : false;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
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
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}