import type { ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export interface InputOption {
  value: string;
  label: string;
}

export type InputType =
  | 'text'
  | 'number'
  | 'password'
  | 'email'
  | 'select'
  | 'multi-select'
  | 'radio'
  | 'custom-comp';

export interface InputConfig<TFieldValues extends FieldValues = FieldValues> {
  name: string;
  type: InputType;
  label?: string;
  placeholder?: string;
  hint?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  options?: InputOption[];
  disabled?: boolean;
  readOnly?: boolean;
  min?: number;
  showPasswordToggle?: boolean;
  customOnChange?: (
    value: unknown,
    formUtils: UseFormReturn<TFieldValues>,
  ) => void;
  customComp?: ReactNode | ((formUtils: UseFormReturn<TFieldValues>) => ReactNode);
  showWhen?: (formUtils: UseFormReturn<TFieldValues>) => boolean;
  getDynamicPlaceholder?: (formUtils: UseFormReturn<TFieldValues>) => string;
  getDynamicDisabled?: (formUtils: UseFormReturn<TFieldValues>) => boolean;
  getDynamicOptions?: (formUtils: UseFormReturn<TFieldValues>) => InputOption[];
}

export interface InputGroup<TFieldValues extends FieldValues = FieldValues> {
  subTitle?: string;
  subTitleTag?: string;
  wrapperClassName?: string;
  outerWrapperClassName?: string;
  render?: InputConfig<TFieldValues>[];
}
