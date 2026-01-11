import React from "react";

const Button = (props: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}) => {
  const {
    onClick,
    className = "",
    children,
    type = "button",
  } = props;

  return (
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      {children}
    </button>
  );
};

export default Button;
