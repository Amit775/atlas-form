import { Provider, Type, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export function createCustomFieldProvider<T>(component: Type<T>): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => component),
  };
}
