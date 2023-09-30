import { EntityState } from '@datorama/akita';
import { AtlasFormField } from './atlas-form-field';
import { AtlasFormOptions } from './atlas-form-options';

export type AtlasFormState<TSchema = unknown> = EntityState<AtlasFormField<TSchema>, string> & {
  options: AtlasFormOptions;
};

export type AtlasFormModel<TSchema = unknown> = AtlasFormState & {
  data: TSchema;
};

export const initialState = <TSchema>(): AtlasFormState<TSchema> => ({
  fields: [],
  options: {},
});
