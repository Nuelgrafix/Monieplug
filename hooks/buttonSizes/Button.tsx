"use client";

import React, { FC } from "react";
import PropTypes from "prop-types";
import styles from "./button.module.css"; // Import as 'styles'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  size?:
    | "small"
    | "cdn"
    | "arrowRight"
    | "sign"
    | "back"
    | "medium"
    | "edit"
    | "large";
  color?: "primary" | "secondary" | "danger";
}

const Button: FC<ButtonProps> = ({
  children,
  onClick = () => {},
  type = "button",
  disabled = false,
  className = "",
  size = "medium small",
  color = "primary",
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[size]} ${styles[color]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  // children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf([
    "small",
    "cdn",
    "sign",
    "arrowRight",
    "back",
    "medium",
    "edit",
    "large",
  ]),
  color: PropTypes.oneOf(["primary", "secondary", "danger"]),
};

export default Button;
