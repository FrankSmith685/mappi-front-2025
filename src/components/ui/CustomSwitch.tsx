import { FormControlLabel, Switch, useMediaQuery } from "@mui/material";
import type { FC } from "react";
import type { CustomSwitchProps, Variant, VariantStyle } from "../../interfaces/DocumentComponent";

export const CustomSwitch: FC<CustomSwitchProps> = ({
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
  const resolvedSize = size ? size : isSmallScreen ? "md" : "lg";

  // 🎨 Paleta de colores unificada
  const colors: Record<Variant, VariantStyle> = {
    primary: {
      border: "#FF6C4F",
      focusBorder: "#e65b43",
      background: "#fff",
      color: "#FF6C4F",
    },
    secondary: {
      border: "#15282D",
      focusBorder: "#0f1f25",
      background: "#fff",
      color: "#15282D",
    },
    terciary: {
      border: "#253238",
      focusBorder: "#1f2b33",
      background: "#fff",
      color: "#253238",
    },
    warning: {
      border: "#B71C1C",
      focusBorder: "#9f1a1a",
      background: "#fff",
      color: "#B71C1C",
    },
  };

  const current = colors[variant];

  const resolvedFontSize = fontSize || (resolvedSize === "lg" ? "16px" : "15px");
  const switchScale = resolvedSize === "lg" ? 1 : 0.9;

  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          sx={{
            transform: `scale(${switchScale})`,
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: current.focusBorder, // Color del "thumb"
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: current.focusBorder, // Color del track
            },
            "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled": {
              color: `${current.focusBorder}80`, // 50% transparencia
            },
            "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled + .MuiSwitch-track": {
              backgroundColor: `${current.focusBorder}40`, // track más claro
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
          color: disabled ? "#999" : current.color,
        },
      }}
    />
  );
};
