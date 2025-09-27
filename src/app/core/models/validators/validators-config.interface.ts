export interface IValidatorsConfig {
  isRequired?: boolean;
  email?: boolean;
  minLength?: string | number | null;
  maxLength?: string | number | null;
  min?: number | null;
  max?: number | null;
  confirmPassword?: boolean;
  defaultValue?: string | number | boolean | null;
  pattern?: string | null;
  disabled?: boolean;
  chipControlName?: string;
}
