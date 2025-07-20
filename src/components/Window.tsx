import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Minus, Square } from "lucide-react";

interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  children: React.ReactNode;
  zIndex?: number;
  onFocus?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Window = ({
  title = "Window",
  isOpen = true,
  onClose = () => {},
  onMinimize = () => {},
  onMaximize = () => {},
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 500, height: 350 },
  children,
  zIndex = 1,
  onFocus = () => {},
  className = "",
  icon,
}: WindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    // Adjust initial position for mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return { x: 10, y: 10 };
    }
    return initialPosition;
  });
  const [size, setSize] = useState(() => {
    // Adjust initial size for mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return {
        width: Math.min(initialSize.width, window.innerWidth - 20),
        height: Math.min(initialSize.height, window.innerHeight - 60),
      };
    }
    return initialSize;
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevSize, setPrevSize] = useState(initialSize);
  const [prevPosition, setPrevPosition] = useState(initialPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);

  // Play Windows 98 sound effects
  const playSound = (action: "close" | "minimize" | "maximize") => {
    // In a real implementation, you would add actual sound files
    console.log(`Playing ${action} sound`);
  };

  const handleClose = () => {
    playSound("close");
    onClose();
  };

  const handleMinimize = () => {
    playSound("minimize");
    onMinimize();
  };

  const handleMaximize = () => {
    playSound("maximize");

    if (!isMaximized) {
      // Save current position and size before maximizing
      setPrevSize(size);
      setPrevPosition(position);

      // Set to maximized state
      setIsMaximized(true);
      const isMobile = window.innerWidth <= 768;
      setSize({
        width: window.innerWidth - (isMobile ? 8 : 4),
        height: window.innerHeight - (isMobile ? 60 : 40),
      }); // Account for taskbar and mobile spacing
      setPosition({ x: isMobile ? 4 : 0, y: isMobile ? 4 : 0 });
    } else {
      // Restore previous size and position
      setIsMaximized(false);
      setSize(prevSize);
      setPosition(prevPosition);
    }

    onMaximize();
  };

  // Handle window focus
  const handleWindowClick = useCallback(() => {
    onFocus();
  }, [onFocus]);

  // Handle drag start
  const handleDragStart = useCallback((event: any, info: any) => {
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: info.point.x - rect.left,
        y: info.point.y - rect.top,
      });
    }
  }, []);

  // Handle drag
  const handleDrag = useCallback(
    (event: any, info: any) => {
      if (!isMaximized) {
        const newX = Math.max(
          0,
          Math.min(window.innerWidth - size.width, info.point.x - dragOffset.x),
        );
        const newY = Math.max(
          0,
          Math.min(
            window.innerHeight - 40 - size.height,
            info.point.y - dragOffset.y,
          ),
        );

        setPosition({ x: newX, y: newY });
      }
    },
    [isMaximized, size, dragOffset],
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up drag constraints
  useEffect(() => {
    const handleResize = () => {
      if (isMaximized) {
        setSize({
          width: window.innerWidth - 4,
          height: window.innerHeight - 40,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMaximized]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={windowRef}
      className={`absolute bg-[#c0c0c0] ${className}`}
      style={{
        width: size.width,
        height: size.height,
        zIndex,
        border: "2px outset #c0c0c0",
        fontFamily: "MS Sans Serif, sans-serif",
      }}
      initial={false}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{ type: "tween", duration: 0.1 }}
      drag={!isMaximized}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - size.width,
        top: 0,
        bottom: window.innerHeight - 40 - size.height,
      }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleWindowClick}
    >
      {/* Title Bar */}
      <div
        ref={titleBarRef}
        className={`win98-titlebar flex items-center justify-between px-1 select-none touch-manipulation ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          background: "linear-gradient(90deg, #000080, #1084d0)",
          color: "white",
          fontSize: "11px",
          fontWeight: "normal",
        }}
      >
        <div
          className="flex items-center gap-1 text-white"
          style={{ fontSize: "11px" }}
        >
          {icon && <div className="mr-1">{icon}</div>}
          {title}
        </div>
        <div className="flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
            className="window-control w-[16px] h-[14px] mr-[2px] flex items-center justify-center bg-[#c0c0c0] text-black text-xs font-bold hover:bg-[#dfdfdf] active:border-inset touch-manipulation"
            style={{ border: "1px outset #c0c0c0" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            _
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            className="window-control w-[16px] h-[14px] mr-[2px] flex items-center justify-center bg-[#c0c0c0] text-black text-xs font-bold hover:bg-[#dfdfdf] active:border-inset touch-manipulation"
            style={{ border: "1px outset #c0c0c0" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            □
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="window-control w-[16px] h-[14px] flex items-center justify-center bg-[#c0c0c0] text-black text-xs font-bold hover:bg-[#dfdfdf] active:border-inset touch-manipulation"
            style={{ border: "1px outset #c0c0c0" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div
        className="p-2 overflow-auto bg-[#c0c0c0]"
        style={{
          height: "calc(100% - 18px)",
          border: "1px inset #c0c0c0",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
