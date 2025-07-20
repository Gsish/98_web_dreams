import React from "react";

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
  position?: { x: number; y: number };
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon = "/vite.svg",
  label = "Icon",
  onClick = () => {},
  position = { x: 20, y: 20 },
}) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-20 h-20 cursor-pointer group select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontFamily: "MS Sans Serif, sans-serif",
      }}
      onClick={onClick}
      onDoubleClick={onClick}
    >
      <div className="w-8 h-8 mb-1 flex items-center justify-center">
        <img
          src={icon}
          alt={label}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "/vite.svg";
          }}
        />
      </div>
      <div className="text-center px-1 py-0.5 text-white text-xs group-hover:bg-[#000080] group-hover:bg-opacity-70 rounded max-w-16 transition-colors">
        <span
          className="break-words leading-tight"
          style={{
            textShadow: "1px 1px 1px rgba(0,0,0,0.8)",
            fontSize: "11px",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default DesktopIcon;
