import React from "react";
import clsx from "clsx";
import styles from "./Button.module.scss";

type Variant = "filled" | "outline" | "ghost";
type Color = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";
type Weight = "normal" | "medium" | "bold";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  color?: Color;
  size?: Size;
  weight?: Weight;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  children,
  variant = "filled",
  color = "primary",
  size = "md",
  weight = "medium",
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  style,
  onClick,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const isIconOnly = !children && (leftIcon || rightIcon);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    onClick?.(e);
  };

  const colorVars = {
    primary: {
      "--btn-bg": "var(--color-primary)",
      "--btn-bg-hover": "var(--color-primary-hover)",
    },
    secondary: {
      "--btn-bg": "var(--color-secondary)",
      "--btn-bg-hover": "var(--color-secondary-hover)",
    },
    danger: {
      "--btn-bg": "var(--color-danger)",
      "--btn-bg-hover": "var(--color-danger-hover)",
    },
  }[color] as React.CSSProperties;

  return (
    <button
      disabled={isDisabled}
      onClick={handleClick}
      style={{ ...colorVars, ...style }}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        styles[weight],
        fullWidth && styles.full,
        isDisabled && styles.disabled,
        loading && styles.loading,
        isIconOnly && styles.iconOnly,
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {leftIcon && (
            <span className={clsx(styles.icon, styles.leftIcon)}>
              {leftIcon}
            </span>
          )}

          {children && <span className={styles.label}>{children}</span>}

          {rightIcon && (
            <span className={clsx(styles.icon, styles.rightIcon)}>
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
