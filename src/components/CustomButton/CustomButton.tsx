import React, { CSSProperties, ReactNode } from "react";

interface ButtonProps {
  color: string;
  text: string;
  icon?: ReactNode;
  onClick: () => void;
  style?: CSSProperties; // Style prop for custom styling
}

const CustomButton: React.FC<ButtonProps> = ({
  color,
  text,
  icon,
  style,
  onClick,
}) => {
  return (
    <button
      className="h-14 items-center rounded-md flex felx-row content-center justify-center mb-1"
      style={{ backgroundColor: color, ...style }}
      onClick={onClick}
    >
      {icon && <span className="button-icon mr-4  text-white">{icon}</span>}
      <span
        style={{
          color: style?.color,
          fontWeight: style?.fontWeight || "normal",
        }}
        className="button-label text-white"
      >
        {text}
      </span>
    </button>
  );
};

export default CustomButton;
