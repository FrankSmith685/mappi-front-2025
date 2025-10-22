import { useState } from "react";
import { TextField, InputAdornment, IconButton, useMediaQuery } from "@mui/material";
import { Search, Visibility, VisibilityOff } from "@mui/icons-material";
import type { ChangeEvent, FC } from "react";
import type { CustomInputProps, Variant, VariantStyle } from "../../interfaces/DocumentComponent";

export const CustomInput: FC<CustomInputProps> = ({
  name,
  inputRef,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  fullWidth = false,
  variant = "primary",
  size = "lg",
  ariaLabel,
  fontSize,
  fontFamily,
  icon,
  label,
  required,
  error = false,
  helperText = "",
  multiline = false,
  rows,
  autoComplete = "off",
  onFocus,
  onBlur,
}) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const responsiveSize = isSmallScreen ? "md" : size || "lg";

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

  const isPassword = type === "password";
  const isSearch = type === "search";
  const isNumber = type === "number";
  const height = responsiveSize === "lg" ? 52 : 44;
  const hasStartAdornment = isSearch || icon;

  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const current = focused ? colors[variant] : neutral;

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    if (isNumber) {
      const val = e.target.value;
      if (/^\d*$/.test(val)) {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (onFocus) onFocus(e); //  Ejecuta si se pasa desde afuera
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (onBlur) onBlur(e); //  Ejecuta si se pasa desde afuera
  };

  return (
    <TextField
      name={name}
      inputRef={inputRef}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      type={
        isPassword
          ? showPassword
            ? "text"
            : "password"
          : isNumber
          ? "text"
          : type
      }
      disabled={disabled}
      fullWidth={fullWidth}
      aria-label={ariaLabel}
      error={error}
      helperText={helperText}
      multiline={multiline}
      rows={rows}
      FormHelperTextProps={{
        sx: {
          backgroundColor: "#fff",
          paddingLeft: 2,
          paddingRight: 2,
          m: 0,
        },
      }}
      InputLabelProps={{
        sx: {
          top: responsiveSize === "md" ? "-6px" : "0px",
          color: current.label,
          "&.Mui-focused": {
            color: current.focusBorder,
          },
        },
      }}
      InputProps={{
        ...(hasStartAdornment && {
          startAdornment: (
            <InputAdornment position="start">
              {isSearch && <Search sx={{ color: "#1F2937" }} />}
              {icon}
            </InputAdornment>
          ),
        }),
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton onClick={handleTogglePassword}>
              {showPassword ? (
                <VisibilityOff className="text-gray-600 !text-2xl" />
              ) : (
                <Visibility className="text-gray-600 !text-2xl" />
              )}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        backgroundColor: current.background,
        width: fullWidth ? "100%" : "auto",
        "& .MuiOutlinedInput-root": {
          minHeight: height,
          "& fieldset": {
            borderColor: current.border,
            borderWidth: "1px",
          },
          "&:hover fieldset": {
            borderColor: current.focusBorder,
            borderWidth: "1px",
          },
          "&.Mui-focused fieldset": {
            borderColor: current.focusBorder,
            borderWidth: "1px",
          },
        },
        "& input": {
          fontSize: fontSize || (responsiveSize === "lg" ? "15px" : "15px"),
          fontFamily: fontFamily || "Arial",
          padding: hasStartAdornment
            ? "0px"
            : responsiveSize === "lg"
            ? "10px 14px"
            : "8px 12px",
          paddingLeft: hasStartAdornment
            ? "0px"
            : responsiveSize === "lg"
            ? "14px"
            : "14px",
          paddingRight: isPassword
            ? responsiveSize === "lg"
              ? "48px"
              : "40px"
            : responsiveSize === "lg"
            ? "14px"
            : "12px",
        },
      }}
      label={label ? `${label}` : undefined}
      required={required}
      autoComplete={autoComplete}
    />
  );
};
