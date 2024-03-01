import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormQuery, FormStore } from './form-store.service';
import { AtlasFormField } from './models';
import { AtlasFormControls, buildControl } from './utils/build-form';
import { StringKeys, ValueOfStringKey } from './utils/types';

@Injectable()
export class FormAPI<TSchema> {
  private store = inject(FormStore<TSchema>);
  public query = inject(FormQuery<TSchema>);
  public form!: FormGroup<AtlasFormControls<TSchema>>;

  public createControl(field: AtlasFormField<TSchema>, value: ValueOfStringKey<TSchema>): void {
    if (this.form.contains(field.name)) return;

    const control = buildControl<TSchema>(field, value);
    this.form.addControl(field.name, control);
    this.store.add(field);
  }

  public removeControl(field: AtlasFormField<TSchema>): void {
    if (!this.form.contains(field.name)) return;

    this.form.controls[field.name].disable();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: fix it
    this.form.removeControl<StringKeys<TSchema>>(field.name);
    this.store.remove(field.name);
  }
}
