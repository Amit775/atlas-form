import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AtlasFormField } from '../models';
import { Validator } from '../models/atlas-form-field-validator';
import { StringKeys, ValueOfStringKey } from './types';

export type AtlasFormControls<TSchema> = { [K in StringKeys<TSchema>]: FormControl<TSchema[K]> };

export function buildControl<TSchema>(
  field: AtlasFormField<TSchema>,
  value: ValueOfStringKey<TSchema>
): FormControl<ValueOfStringKey<TSchema>> {
  const validators: ValidatorFn[] | undefined = field.validators?.map(createValidator);
  return new FormControl(value ?? field.defaultValue, { nonNullable: true, validators });
}

export function buildForm<TSchema>(
  schema: AtlasFormField<TSchema>[],
  value: TSchema
): FormGroup<AtlasFormControls<TSchema>> {
  const group: AtlasFormControls<TSchema> = {} as AtlasFormControls<TSchema>;
  schema.forEach((field: AtlasFormField<TSchema>) => {
    group[field.name] = buildControl(field, value[field.name]);
  });

  return new FormGroup<AtlasFormControls<TSchema>>(group);
}

function createValidator(validator: Validator): ValidatorFn {
  switch (validator.type) {
    case 'max':
      return Validators.max(validator.max);
    case 'min':
      return Validators.min(validator.min);
    case 'max-length':
      return Validators.maxLength(validator.maxLength);
    case 'min-length':
      return Validators.minLength(validator.minLength);
    case 'pattern':
      return Validators.pattern(validator.pattern);
    case 'required':
      return Validators.required;
  }
}
