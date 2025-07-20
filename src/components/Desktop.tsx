import React, { useState, useRef } from "react";
import Window from "./Window";

interface WindowData {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type: "notepad" | "explorer" | "image" | "document";
}

interface DesktopIconProps {
  id: string;
  name: string;
  icon: string;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  name,
  icon,
  onClick,
}) => {
  return (
    <div
      className="desktop-icon flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-blue-100 hover:bg-opacity-30 touch-manipulation"
      onClick={onClick}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-white text-xs text-center break-words">{name}</div>
    </div>
  );
};

interface DesktopProps {
  onWindowOpen?: (windowId: string) => void;
  onWindowClose?: (windowId: string) => void;
  onWindowMinimize?: (windowId: string) => void;
  onWindowFocus?: (windowId: string) => void;
  initialWindows?: WindowData[];
  wallpaper?: string;
}

const Desktop: React.FC<DesktopProps> = ({
  onWindowOpen,
  onWindowClose,
  onWindowMinimize,
  onWindowFocus,
  initialWindows = [],
  wallpaper,
}) => {
  const [windows, setWindows] = useState<WindowData[]>(initialWindows);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Default desktop icons
  const defaultIcons = [
    {
      id: "portfolio",
      name: "portfolio.txt",
      icon: "📄",
      type: "notepad",
      content: (
        <div className="p-4">
          <h1 className="text-xl mb-4">My Portfolio</h1>
          <p className="mb-2">Name: John Doe</p>
          <p className="mb-2">Skills: React, TypeScript, UI/UX Design</p>
          <p className="mb-2">Email: john.doe@example.com</p>
          <p className="mb-2">GitHub: github.com/johndoe</p>
        </div>
      ),
    },
    {
      id: "resume",
      name: "resume.doc",
      icon: "📝",
      type: "document",
      content: (
        <div className="p-4">
          <h1 className="text-xl mb-4">Resume</h1>
          <h2 className="text-lg mb-2">Experience</h2>
          <p className="mb-4">Senior Developer at Tech Corp (2020-Present)</p>
          <p className="mb-4">Web Developer at Digital Solutions (2018-2020)</p>
          <h2 className="text-lg mb-2">Education</h2>
          <p className="mb-2">BS Computer Science, University of Technology</p>
        </div>
      ),
    },
    {
      id: "projects",
      name: "projects.txt",
      icon: "🗂️",
      type: "notepad",
      content: (
        <div className="p-4">
          <h1 className="text-xl mb-4">Projects</h1>
          <p className="mb-2">E-commerce Platform</p>
          <p className="mb-4">Built with React, Node.js, and MongoDB</p>
          <p className="mb-2">Weather App</p>
          <p className="mb-4">Built with React and OpenWeather API</p>
          <p className="mb-2">Task Management System</p>
          <p>Built with React, Express, and PostgreSQL</p>
        </div>
      ),
    },
  ];

  const handleIconClick = (iconId: string, iconData: any) => {
    // Check if window is already open
    const existingWindow = windows.find((w) => w.id === iconId);

    if (existingWindow) {
      // If minimized, restore it and bring to front
      if (existingWindow.isMinimized) {
        handleWindowRestore(iconId);
      }
      // Bring to front
      handleWindowFocus(iconId);
      return;
    }

    // Create new window
    const newWindow: WindowData = {
      id: iconId,
      title: iconData.name,
      content: iconData.content,
      isOpen: true,
      isMinimized: false,
      zIndex: highestZIndex + 1,
      position: { x: 50 + windows.length * 20, y: 50 + windows.length * 20 },
      size: { width: 500, height: 400 },
      type: iconData.type,
    };

    setWindows([...windows, newWindow]);
    setHighestZIndex(highestZIndex + 1);

    if (onWindowOpen) {
      onWindowOpen(iconId);
    }
  };

  const handleWindowClose = (windowId: string) => {
    setWindows(windows.filter((w) => w.id !== windowId));

    if (onWindowClose) {
      onWindowClose(windowId);
    }
  };

  const handleWindowMinimize = (windowId: string) => {
    setWindows(
      windows.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w)),
    );

    if (onWindowMinimize) {
      onWindowMinimize(windowId);
    }
  };

  const handleWindowRestore = (windowId: string) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId
          ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
          : w,
      ),
    );
    setHighestZIndex(highestZIndex + 1);
  };

  const handleWindowFocus = (windowId: string) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId ? { ...w, zIndex: highestZIndex + 1 } : w,
      ),
    );
    setHighestZIndex(highestZIndex + 1);

    if (onWindowFocus) {
      onWindowFocus(windowId);
    }
  };

  const handleWindowDrag = (
    windowId: string,
    position: { x: number; y: number },
  ) => {
    setWindows(
      windows.map((w) => (w.id === windowId ? { ...w, position } : w)),
    );
  };

  // Play system sound
  const playSound = (
    soundType: "open" | "close" | "minimize" | "maximize" | "click",
  ) => {
    // This would be implemented with actual sound files
    console.log(`Playing ${soundType} sound`);
  };

  return (
    <div
      ref={desktopRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: "#008080", // Classic Win98 teal
        backgroundImage: wallpaper ? `url(${wallpaper})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Desktop Icons */}
      <div className="p-2 sm:p-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
        {defaultIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            icon={icon.icon}
            onClick={() => handleIconClick(icon.id, icon)}
          />
        ))}
      </div>

      {/* Windows */}
      {windows
        .filter((w) => w.isOpen && !w.isMinimized)
        .map((window) => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
            type={window.type}
            onClose={() => handleWindowClose(window.id)}
            onMinimize={() => handleWindowMinimize(window.id)}
            onFocus={() => handleWindowFocus(window.id)}
            onDrag={(position) => handleWindowDrag(window.id, position)}
          >
            {window.content}
          </Window>
        ))}
    </div>
  );
};

export default Desktop;
