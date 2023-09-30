export type Validator =
  | MinLengthValidator
  | MaxLengthValidator
  | MinValidator
  | MaxValidator
  | PatternValidator
  | RequiredValidator;
export type ValidatorType = Validator['type'];

export type RequiredValidator = {
  type: 'required';
};

export type MinLengthValidator = {
  type: 'min-length';
  minLength: number;
};

export type MaxLengthValidator = {
  type: 'max-length';
  maxLength: number;
};

export type MinValidator = {
  type: 'min';
  min: number;
};

export type MaxValidator = {
  type: 'max';
  max: number;
};

export type PatternValidator = {
  type: 'pattern';
  pattern: string | RegExp;
};
