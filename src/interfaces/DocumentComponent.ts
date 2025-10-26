import type { SelectChangeEvent } from "@mui/material";
import type { ChangeEvent, ForwardedRef, ReactNode } from "react";

// ComponentDoc
export interface PropDoc { name: string; description: string; type?: string; required?: boolean; values?: string[]; defaultValue?: string; example?: string; notes?: string; }
export interface ComponentDocProps { name: string; description: string; props: PropDoc[]; children: React.ReactNode; }


export interface PropItem {
  name: string;
  description: string;
  type: string;
  required: boolean;
  example: string;
  values: string[];
  defaultValue: string;
  notes: string;
}


export type Variant =
  | "primary"
  | "secondary"
  | "terciary"
  | "warning"

export type VariantButton =
  | "primary"
  | "secondary"
  | "terciary"
  | "warning"
  | "primary-outline"
  | "primary-outline-white"
  | "secondary-outline"
  | "terciary-outline"
  | "warning-outline";

export interface VariantStyle {
  border?: string;
  focusBorder?: string;
  background?: string;
  color?: string;
  label?:string;
  bg?: string;
  hoverBg?: string;
  hoverColor?: string;
}

// CustomButton
export interface CustomButtonProps {
  id?: string;
  text: string;
  onClick?: () => void;
  size?: "md" | "lg";
  variant?: VariantButton;
  icon?: ReactNode;
  uppercase?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number | string;

}

// CustomInput
export interface CustomInputProps {
  name?: string;
  inputRef?: ForwardedRef<HTMLInputElement>;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: Variant;
  size?: "md" | "lg";
  ariaLabel?: string;
  fontSize?: string;
  fontFamily?: string;
  icon?: ReactNode;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  autoComplete?:string;
  onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
}

// CustomSelected
export interface CustomSelectProps {
  value: string | number;
  onChange: (e: SelectChangeEvent<string | number>) => void;
  options: Array<{ label: string; value: string | number }>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: Variant;
  size?: "md" | "lg";
  fontSize?: string;
  fontFamily?: string;
  error?: boolean;
  helperText?: string;
}

// CustomCheckbox
export interface CustomCheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  variant?: Variant;
  fontSize?: string;
  fontFamily?: string;
  disabled?: boolean;
  size?: "md" | "lg";
}

// CustomSwitch
export interface CustomSwitchProps {
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  variant?: Variant;
  fontSize?: string;
  fontFamily?: string;
  disabled?: boolean;
  size?: "md" | "lg";
}
