import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock } from "lucide-react";

interface TaskbarProps {
  openWindows: {
    id: string;
    title: string;
    isActive: boolean;
  }[];
  onWindowSelect: (id: string) => void;
  onStartClick?: () => void;
  showStartMenu?: boolean;
  onStartMenuToggle?: () => void;
}

const Taskbar = ({
  openWindows = [],
  onWindowSelect = () => {},
  onStartClick = () => {},
  showStartMenu = false,
  onStartMenuToggle = () => {},
}: TaskbarProps) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [startPressed, setStartPressed] = useState(false);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const ampm = hours >= 12 ? "PM" : "AM";
      setCurrentTime(
        `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`,
      );
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-7 sm:h-8 md:h-7 bg-[#c0c0c0] flex items-center justify-between px-1 z-50"
      style={{
        border: "1px outset #c0c0c0",
        fontFamily: "MS Sans Serif, sans-serif",
      }}
    >
      <div className="flex items-center">
        {/* Start button */}
        <button
          className={`taskbar-button h-6 sm:h-7 md:h-6 mr-1 bg-[#c0c0c0] flex items-center justify-center px-2 py-1 text-xs font-bold hover:bg-[#dfdfdf] active:bg-[#a0a0a0] transition-colors touch-manipulation`}
          style={{
            border: startPressed ? "1px inset #c0c0c0" : "1px outset #c0c0c0",
            fontFamily: "MS Sans Serif, sans-serif",
          }}
          onMouseDown={() => setStartPressed(true)}
          onMouseUp={() => setStartPressed(false)}
          onMouseLeave={() => setStartPressed(false)}
          onClick={() => {
            // Play Windows 98 start sound
            const audio = new Audio(
              "https://www.myinstants.com/media/sounds/windows-98-startup.mp3",
            );
            audio.volume = 0.2;
            audio.play().catch((e) => console.log("Sound play failed:", e));
            onStartClick();
            onStartMenuToggle();
          }}
        >
          <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-sm flex items-center justify-center mr-1">
            <div className="text-white text-xs font-bold">⊞</div>
          </div>
          <span>Start</span>
        </button>

        {/* Separator */}
        <div className="h-6 w-[1px] mx-1 bg-[#808080] border-r border-[#ffffff]"></div>

        {/* Open windows */}
        <div className="flex items-center space-x-1 overflow-x-auto flex-1 mx-2">
          {openWindows.map((window) => (
            <button
              key={window.id}
              className={`taskbar-button h-6 sm:h-7 md:h-6 px-2 py-1 text-xs bg-[#c0c0c0] flex items-center justify-start min-w-[80px] sm:min-w-[120px] max-w-[120px] sm:max-w-[200px] hover:bg-[#dfdfdf] transition-colors touch-manipulation`}
              onClick={() => onWindowSelect(window.id)}
              style={{
                border: window.isActive
                  ? "1px inset #c0c0c0"
                  : "1px outset #c0c0c0",
                fontFamily: "MS Sans Serif, sans-serif",
              }}
            >
              <img
                src={
                  window.title.includes(".txt")
                    ? "https://win98icons.alexmeub.com/icons/png/notepad-0.png"
                    : "https://win98icons.alexmeub.com/icons/png/document-0.png"
                }
                alt="Window icon"
                className="w-3 h-3 mr-1 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = "/vite.svg";
                }}
              />
              <span className="truncate text-xs sm:text-xs">
                {window.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* System tray */}
      <div
        className="flex items-center h-6 sm:h-7 md:h-6 px-1 sm:px-2 bg-[#c0c0c0] flex-shrink-0"
        style={{ border: "1px inset #c0c0c0" }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <span className="text-xs whitespace-nowrap">{currentTime}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current time</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div
          className="absolute bottom-7 sm:bottom-8 md:bottom-7 left-1 w-56 sm:w-64 bg-[#c0c0c0] shadow-lg z-50"
          style={{
            border: "2px outset #c0c0c0",
            fontFamily: "MS Sans Serif, sans-serif",
          }}
        >
          {/* Start Menu Header */}
          <div
            className="h-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-2 flex items-center text-xs font-bold"
            style={{ fontFamily: "MS Sans Serif, sans-serif" }}
          >
            Windows 98
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-xs flex items-center">
              <img
                src="https://win98icons.alexmeub.com/icons/png/programs-0.png"
                alt="Programs"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/vite.svg";
                }}
              />
              Programs
              <span className="ml-auto">▶</span>
            </div>
            <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-xs flex items-center">
              <img
                src="https://win98icons.alexmeub.com/icons/png/document-0.png"
                alt="Documents"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/vite.svg";
                }}
              />
              Documents
              <span className="ml-auto">▶</span>
            </div>
            <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-xs flex items-center">
              <img
                src="https://win98icons.alexmeub.com/icons/png/settings_gear-0.png"
                alt="Settings"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/vite.svg";
                }}
              />
              Settings
            </div>
            <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-xs flex items-center">
              <img
                src="https://win98icons.alexmeub.com/icons/png/search_file-0.png"
                alt="Find"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/vite.svg";
                }}
              />
              Find
            </div>
            <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-xs flex items-center">
              <img
                src="https://win98icons.alexmeub.com/icons/png/help_book_cool-0.png"
                alt="Help"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/vite.svg";
                }}
              />
              Help
            </div>
            <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-xs flex items-center">
              <img
                src="https://win98icons.alexmeub.com/icons/png/run-0.png"
                alt="Run"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/vite.svg";
                }}
              />
              Run...
            </div>

            {/* Separator */}
            <div className="mx-2 my-1 h-px bg-gray-400"></div>

            <div className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-xs flex items-center">
              <img
                src="https://win98icons.alexmeub.com/icons/png/shut_down_normal-0.png"
                alt="Shut Down"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/vite.svg";
                }}
              />
              Shut Down...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Taskbar;
