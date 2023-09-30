import { Type } from '@angular/core';
import { NumberComponent } from '../ui/number/number.component';
import { TextFieldComponent } from '../ui/text-field/text-field.component';
import { BaseFieldComponent } from '../ui/base-field.component';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: fix it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
