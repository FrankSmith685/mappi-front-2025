import { Alert } from "@mui/material";
import type { FC, ReactNode } from "react";
import { FaCheckCircle, FaInfoCircle, FaExclamationCircle } from "react-icons/fa";

type CustomVariant = "primary" | "secondary" | "terciary" | "warning";

interface VariantStyle {
  border: string;
  focusBorder: string;
  background: string;
  color: string;
}

const colors: Record<CustomVariant, VariantStyle> = {
  primary: {
    border: "#FF6C4F",
    focusBorder: "#FF6C4F",
    background: "#FFF5F2", // fondo suave para contraste
    color: "#FF6C4F",
  },
  secondary: {
    border: "#15282D",
    focusBorder: "#15282D",
    background: "#F2F5F7",
    color: "#15282D",
  },
  terciary: {
    border: "#253238",
    focusBorder: "#253238",
    background: "#F1F4F7",
    color: "#253238",
  },
  warning: {
    border: "#B71C1C",
    focusBorder: "#B71C1C",
    background: "#FFF0F0",
    color: "#B71C1C",
  },
};

// Íconos por defecto según variante
const defaultIcons: Record<CustomVariant, ReactNode> = {
  primary: <FaCheckCircle size={20} />,
  secondary: <FaInfoCircle size={20} />,
  terciary: <FaInfoCircle size={20} />,
  warning: <FaExclamationCircle size={20} />,
};

interface CustomAlertProps {
  message: string;
  variant?: CustomVariant;
  show?: boolean;
  icon?: ReactNode; // puedes sobreescribir el ícono si quieres
}

const CustomAlert: FC<CustomAlertProps> = ({
  message,
  variant = "primary",
  show = true,
  icon,
}) => {
  if (!show) return null;

  const style = colors[variant];
  const chosenIcon = icon !== undefined ? icon : defaultIcons[variant];

  return (
    <Alert
      icon={icon === null ? false : chosenIcon}
      sx={{
        backgroundColor: style.background,
        color: style.color,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: "6px",
        fontSize: "0.95rem",
        paddingY: 1,
        paddingX: 2,
        ".MuiAlert-icon": {
          color: style.color,
        },
      }}
    >
      {message}
    </Alert>
  );
};

export default CustomAlert;
