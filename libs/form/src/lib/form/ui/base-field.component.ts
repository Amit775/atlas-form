import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AtlasFormField } from '../models';

@Directive()
export abstract class BaseFieldComponent<TSchema, V> {
  @Input() field!: AtlasFormField<TSchema>;
  @Input() value!: V;
  @Output() valueChange = new EventEmitter<V>();

  emit(value: V): void {
    this.valueChange.emit(value);
  }
}
