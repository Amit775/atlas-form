import { Type } from '@angular/core';
import { NumberComponent } from '../ui/number/number.component';
import { TextFieldComponent } from '../ui/text-field/text-field.component';
import { BaseFieldComponent } from '../ui/base-field.component';

// @ts-ignore: fix it
export function getComponentType<TSchema>(name: string): Type<BaseFieldComponent<TSchema, any>> {
  switch (name) {
    case 'text':
      return TextFieldComponent;
    case 'number':
      return NumberComponent;
    default:
      throw `unkown component ${name}`;
  }
}
