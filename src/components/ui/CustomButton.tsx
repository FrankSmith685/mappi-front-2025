import { Button, CircularProgress, useMediaQuery } from "@mui/material";
import type { FC } from "react";
import type { CustomButtonProps, VariantButton, VariantStyle } from "../../interfaces/DocumentComponent";

export const CustomButton: FC<CustomButtonProps> = ({
  id,
  text,
  onClick,
  size,
  variant = "primary" as VariantButton,
  icon,
  uppercase = false,
  fullWidth = false,
  disabled = false,
  loading = false,
  type = "button",
  ariaLabel,
  fontSize,
  fontFamily,
  fontWeight,
}) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const effectiveSize = isSmallScreen ? "md" : size || "lg";

  const baseColors: Record<string, VariantStyle> = {
    primary: {
      bg: "#FF6C4F",
      color: "#fff",
      hoverBg: "#e65b43",
      border: "none",
    },
    secondary: {
      bg: "#15282D",
      color: "#fff",
      hoverBg: "#0f1f25",
      border: "none",
    },
    terciary: {
      bg: "#253238",
      color: "#fff",
      hoverBg: "#1f2b33",
      border: "none",
    },
    warning: {
      bg: "#B71C1C",
      color: "#fff",
      hoverBg: "#9f1a1a",
      border: "none",
    },
    "primary-outline": {
      bg: "transparent",
      color: "#FF6C4F",
      hoverBg: "#ffe8e3",
      border: "1px solid #FF6C4F",
      hoverColor: "#FF6C4F",
    },
    "primary-outline-white": {
      bg: "transparent",
      color: "white",
      hoverBg: "#ffe8e3",
      border: "1px solid white",
      hoverColor: "#FF6C4F",
    },
    "secondary-outline": {
      bg: "#fff",
      color: "#15282D",
      hoverBg: "#f0f4f7",
      border: "1px solid #15282D",
      hoverColor: "#15282D",
    },
    "terciary-outline": {
      bg: "#fff",
      color: "#253238",
      hoverBg: "#f2f5f9",
      border: "1px solid #253238",
      hoverColor: "#253238",
    },
    "warning-outline": {
      bg: "#fff",
      color: "#B71C1C",
      hoverBg: "#f9e8e8",
      border: "1px solid #B71C1C",
      hoverColor: "#B71C1C",
    },
  };

  const current = baseColors[variant];
  const isOutline = variant.includes("outline");
  const height = effectiveSize === "lg" ? 52 : 44;

  return (
    <Button
      id={id}
      variant={isOutline ? "outlined" : "contained"}
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      type={type}
      aria-label={ariaLabel}
      sx={{
        textTransform: uppercase ? "uppercase" : "none",
        fontWeight: fontWeight ?? 600,
        fontSize: fontSize || (effectiveSize === "lg" ? "1.2rem" : "1rem"),
        fontFamily: fontFamily || "arial",
        height,
        backgroundColor: current.bg,
        color: current.color,
        border: current.border,
        borderRadius: "5px",
        transition: "all 0.3s",
        "&:hover": {
          backgroundColor: current.hoverBg,
          color: current.hoverColor ?? current.color,
        },
      }}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : icon}
    >
      {loading ? "Cargando..." : text}
    </Button>
  );
};
