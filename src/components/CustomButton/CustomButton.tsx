import React, { CSSProperties, ReactNode } from "react";

interface ButtonProps {
  color: string;
  text: string;
  icon?: ReactNode;
  onClick: () => void;
  style?: CSSProperties;
  disable?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  color,
  text,
  icon,
  style,
  onClick,
  disable,
}) => {
  return (
    <button
      className="h-14 items-center rounded-md flex flex-row content-center justify-center mb-1"
      style={{ backgroundColor: color, ...style }}
      disabled={disable}
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
