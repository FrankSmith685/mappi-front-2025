import { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  useMediaQuery,
  FormHelperText,
} from "@mui/material";
import type { FC } from "react";
import type {
  CustomSelectProps,
  Variant,
  VariantStyle,
} from "../../interfaces/DocumentComponent";

export const CustomSelected: FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  label = "Seleccione una opción",
  placeholder = "Seleccione una opción",
  disabled = false,
  fullWidth = false,
  variant = "primary",
  size,
  fontSize,
  fontFamily,
  error = false,
  helperText = "",
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

  const neutral: VariantStyle = {
    border: "#ccc",
    focusBorder: "#999",
    background: "#fff",
    color: "#000",
    label: "#666",
  };

  const [focused, setFocused] = useState(false);
  const hasValue = value !== "" && value !== undefined && value !== null;
  const current = focused || hasValue ? colors[variant] : neutral;

  const height = resolvedSize === "lg" ? 52 : 44;
  const internalFontSize = fontSize || (resolvedSize === "lg" ? "16px" : "15px");

  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      sx={{ minWidth: 200 }}
    >
      {hasValue && (
        <InputLabel
          sx={{
            fontSize: internalFontSize,
            color: current.label,
            "&.Mui-focused": {
              color: current.focusBorder,
            },
            "&.MuiInputLabel-shrink": {
              color: current.label,
            },
          }}
        >
          {label}
        </InputLabel>
      )}

      <Select
        value={value}
        onChange={onChange}
        disabled={disabled}
        displayEmpty
        input={
          <OutlinedInput
            label={hasValue ? label : undefined}
            sx={{
              height: `${height}px !important`,
              padding: 0,
            }}
          />
        }
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: "#666" }}>{placeholder}</span>;
          }
          return options.find((opt) => opt.value === selected)?.label;
        }}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              mt: 1,
              border: `1px solid ${current.border}`,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              "& .MuiMenuItem-root": {
                fontSize: internalFontSize,
                fontFamily: fontFamily || "Arial",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ffe8e3", // para primary, puedes hacerlo dinámico
                  "&:hover": {
                    backgroundColor: "#ffd6cc",
                  },
                },
              },
            },
            
          },
         
        }}
        sx={{
          height: `${height}px`,
          fontSize: internalFontSize,
          "& .MuiSelect-select": {
            minHeight: `${height}px`,
            lineHeight: `${height}px`,
            fontSize: internalFontSize,
            padding: "0 14px",
            fontFamily: fontFamily || "Arial",
            color: current.label,
            display: "block",
            textAlign: "left",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: hasValue ? current.label : current.border,
            borderWidth: "1px !important",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: current.focusBorder,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: current.focusBorder,
          },
        }}
      >
        {/* Placeholder como opción deshabilitada */}
        <MenuItem disabled value="">
          {placeholder}
        </MenuItem>

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText && (
        <FormHelperText sx={{ backgroundColor: "#fff", px: 2, m: 0 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
