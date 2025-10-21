import { Chip } from "@mui/material";
import type { FC } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

export interface CustomChipProps {
  label: string;
  onClick?: () => void;
  onDelete?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "terciary"
    | "warning"
    | "primary-outline"
    | "secondary-outline"
    | "terciary-outline"
    | "warning-outline";
  size?: "small" | "medium";
  icon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  clickable?: boolean;
  selected?: boolean;
}

// 🎨 Centralizamos la paleta de colores
const colors = {
  primary: "#FF6C4F",
  secondary: "#15282D",
  terciary: "#253238",
  warning: "#B71C1C",
};

const baseColors: Record<
  string,
  { bg: string; color: string; hoverBg: string; border: string; hoverColor?: string }
> = {
  primary: { bg: colors.primary, color: "#fff", hoverBg: "#e65b43", border: "none" },
  secondary: { bg: colors.secondary, color: "#fff", hoverBg: "#0f1f25", border: "none" },
  terciary: { bg: colors.terciary, color: "#fff", hoverBg: "#1f2b33", border: "none" },
  warning: { bg: colors.warning, color: "#fff", hoverBg: "#9f1a1a", border: "none" },

  "primary-outline": {
    bg: "#fff",
    color: colors.primary,
    hoverBg: "#ffe8e3",
    border: `1px solid ${colors.primary}`,
    hoverColor: colors.primary,
  },
  "secondary-outline": {
    bg: "#fff",
    color: colors.secondary,
    hoverBg: "#f0f4f7",
    border: `1px solid ${colors.secondary}`,
    hoverColor: colors.secondary,
  },
  "terciary-outline": {
    bg: "#fff",
    color: colors.terciary,
    hoverBg: "#f2f5f9",
    border: `1px solid ${colors.terciary}`,
    hoverColor: colors.terciary,
  },
  "warning-outline": {
    bg: "#fff",
    color: colors.warning,
    hoverBg: "#f9e8e8",
    border: `1px solid ${colors.warning}`,
    hoverColor: colors.warning,
  },
};

export const CustomChip: FC<CustomChipProps> = ({
  label,
  onClick,
  onDelete,
  variant = "primary",
  size = "medium",
  selected = false,
  clickable = true,
}) => {
  const current = baseColors[variant];

  return (
    <Chip
      label={label}
      onClick={clickable ? onClick : undefined}
      onDelete={onDelete}
      icon={selected ? <FaCheckCircle size={18} /> : undefined}
      deleteIcon={onDelete ? <FaTimes size={18} /> : undefined}
      size={size}
      clickable={clickable}
      sx={{
        backgroundColor: current.bg,
        color: current.color,
        border: current.border,
        fontWeight: 500,
        fontFamily: "Arial",
        transition: "all 0.3s ease",
        boxShadow: isOutline(variant) ? "none" : "0px 2px 6px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          backgroundColor: current.hoverBg,
          color: current.hoverColor ?? current.color,
          transform: "scale(1.05)",
          boxShadow: isOutline(variant)
            ? "0px 0px 8px rgba(0, 0, 0, 0.05)"
            : "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
        "& .MuiChip-icon": {
          color: current.color,
        },
        "& .MuiChip-deleteIcon": {
          color: current.color,
          "&:hover": {
            color: current.hoverColor ?? current.color,
          },
        },
      }}
    />
  );
};

function isOutline(variant: string) {
  return variant.includes("outline");
}
