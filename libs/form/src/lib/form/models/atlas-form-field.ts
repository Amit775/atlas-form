import { OneOf, StringKeys } from '../utils/types';
import { Validator } from './atlas-form-field-validator';

export type WithJsonPath = {
  jsonPath?: string;
};

export type WithOntology = {
  ontology?: string;
};

export type BaseAtlasFormField<TSchema> = OneOf<WithJsonPath, WithOntology> & {
  isHidden?: boolean;
  name: StringKeys<TSchema>;
  validators?: Validator[];
  defaultValue: TSchema[StringKeys<TSchema>];
};

export type AtlasFormStringField<TSchema> = BaseAtlasFormField<TSchema> & {
  ui: 'text';
  defaultValue: string;
};

export type AtlasFormNumberField<TSchema> = BaseAtlasFormField<TSchema> & {
  ui: 'number';
  defaultValue: number;
};

export type AtlasFormField<TSchema> = AtlasFormNumberField<TSchema> | AtlasFormStringField<TSchema>;
