import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { AtlasFormField } from '../models';
import { createCustomFieldProvider } from '../utils/custom-field-provider';
import { getComponentType } from './field-factory';

@Component({
  selector: 'atlas-form-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [createCustomFieldProvider(FieldComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent<TSchema, V> implements AfterViewInit, ControlValueAccessor {
  @Input() field!: AtlasFormField<TSchema>;
  @Input() value!: V;

  @ViewChild('fieldContainer', { read: ViewContainerRef }) private container?: ViewContainerRef;

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  onChange: (value: V) => void = () => undefined;
  onTouched: () => void = () => undefined;

  writeValue(value: V): void {
    this.value = value;
  }

  registerOnChange(onChange: () => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  ngAfterViewInit(): void {
    if (!this.container) return;

    const componentType = getComponentType(this.field.ui);
    const component = this.container.createComponent(componentType);
    component.setInput('value', this.value);
    component.setInput('field', this.field);
    component.instance.valueChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => this.onChange(value));
    this.cdr.detectChanges();
  }
}
