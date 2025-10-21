import { Link as MuiLink, useMediaQuery } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { FC, ReactNode, MouseEvent } from "react";
import type { VariantButton, VariantStyle } from "../../interfaces/DocumentComponent";

interface CustomLinkProps {
  to?: string;
  href?: string;
  text: string;
  icon?: ReactNode;
  variant?: VariantButton;
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  underline?: "always" | "hover" | "none";
  target?: "_blank" | "_self";
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const CustomLink: FC<CustomLinkProps> = ({
  to,
  href,
  text,
  icon,
  variant = "primary",
  fontSize,
  fontWeight,
  fontFamily,
  underline = "hover",
  target = "_self",
  onClick,
}) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const effectiveSize = isSmallScreen ? "md" : "lg";

  // 🎨 Paleta unificada
  const linkColors: Record<string, VariantStyle> = {
    primary: { color: "#FF6C4F", hoverColor: "#e65b43" },
    secondary: { color: "#15282D", hoverColor: "#0f1f25" },
    terciary: { color: "#253238", hoverColor: "#1f2b33" },
    warning: { color: "#B71C1C", hoverColor: "#9f1a1a" },
  };

  const current = linkColors[variant] ?? linkColors.primary;

  const linkProps = {
    component: to ? RouterLink : "a",
    to,
    href,
    target,
    onClick,
  };

  return (
    <MuiLink
      {...linkProps}
      underline={underline}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        fontSize: fontSize || (effectiveSize === "lg" ? "1rem" : "0.9rem"),
        fontWeight: fontWeight ?? 500,
        fontFamily: fontFamily || "Arial",
        color: current.color,
        transition: "color 0.2s ease",
        "&:hover": {
          color: current.hoverColor ?? current.color,
        },
        cursor: "pointer",
      }}
    >
      {icon}
      {text}
    </MuiLink>
  );
};
