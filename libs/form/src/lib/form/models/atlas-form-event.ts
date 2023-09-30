import { FormAPI } from '../form-api.service';

export type AtlasFormEvent<TSchema = unknown> = {
  api: FormAPI<TSchema>;
};

export type AtlasFormReadyEvent<TSchema = unknown> = AtlasFormEvent<TSchema>;
