import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-custom-textarea',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-textarea-container">
      <label *ngIf="label" [for]="textareaId" class="custom-label">{{ label }}</label>
      <textarea 
        [id]="textareaId"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [readonly]="readonly"
        [attr.maxlength]="maxLength"
        [rows]="rows"
        [required]="required"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="custom-textarea"
        [class.error]="hasError"
        [class.disabled]="disabled"
      ></textarea>
      <div *ngIf="hasError && errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div *ngIf="hint" class="hint-message">
        {{ hint }}
      </div>
    </div>
  `,
  styleUrls: ['./custom-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true
    }
  ]
})
export class CustomTextareaComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() maxLength: number | null = null;
  @Input() rows: number = 3;
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() control: AbstractControl | null = null;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  value: string = '';
  textareaId: string = `custom-textarea-${Math.random().toString(36).substr(2, 9)}`;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return this.control ? this.control.invalid && (this.control.dirty || this.control.touched) : false;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}