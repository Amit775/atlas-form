import { Injectable } from '@angular/core';
import { EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { produce } from 'immer';
import { AtlasFormField, AtlasFormState, initialState } from './models';

@StoreConfig({ name: 'form', producerFn: produce, idKey: 'name' })
@Injectable({ providedIn: 'root' })
export class FormStore<TSchema> extends EntityStore<AtlasFormState<TSchema>> {
  // prettier-ignore
  constructor() { super(initialState()); }
}

@Injectable({ providedIn: 'root' })
export class FormQuery<TSchema> extends QueryEntity<AtlasFormState<TSchema>> {
  // prettier-ignore
  constructor(store: FormStore<TSchema>) { super(store); }

  getFields(): AtlasFormField<TSchema>[] {
    return this.getAll();
  }
}
