import { FormControlLabel, Checkbox, useMediaQuery } from "@mui/material";
import type { FC } from "react";
import type { CustomCheckboxProps, Variant, VariantStyle } from "../../interfaces/DocumentComponent";

export const CustomCheckbox: FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  variant = "primary",
  fontSize,
  fontFamily = "Arial",
  disabled = false,
  size,
}) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const resolvedSize = size || (isSmallScreen ? "md" : "lg");
  const resolvedFontSize = fontSize || (resolvedSize === "lg" ? "16px" : "15px");

  const colors: Record<Variant, VariantStyle> = {
    primary: {
      border: "#FF6C4F",
      focusBorder: "#FF6C4F",
      background: "#fff",
      color: "#FF6C4F",
    },
    secondary: {
      border: "#15282D",
      focusBorder: "#15282D",
      background: "#fff",
      color: "#15282D",
    },
    terciary: {
      border: "#253238",
      focusBorder: "#253238",
      background: "#fff",
      color: "#253238",
    },
    warning: {
      border: "#B71C1C",
      focusBorder: "#B71C1C",
      background: "#fff",
      color: "#B71C1C",
    },
  };

  const current = colors[variant];

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          sx={{
            transform: resolvedSize === "lg" ? "scale(1)" : "scale(0.9)",
            color: current.border,
            "&.Mui-checked": {
              color: current.focusBorder,
            },
          }}
        />
      }
      label={label}
      sx={{
        fontSize: resolvedFontSize,
        fontFamily,
        "& .MuiFormControlLabel-label": {
          fontSize: resolvedFontSize,
          fontFamily,
        },
      }}
    />
  );
};
