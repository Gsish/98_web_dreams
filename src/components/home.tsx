import React, { useState, useEffect } from "react";
import Window from "./Window";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";

interface WindowData {
  id: string;
  title: string;
  type: "notepad" | "document" | "explorer";
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const Home = () => {
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [windows, setWindows] = useState<WindowData[]>([
    {
      id: "portfolio",
      title: "portfolio.txt - Notepad",
      type: "notepad",
      content: (
        <div className="p-2 font-mono text-sm">
          <h1 className="text-lg mb-4">My Portfolio</h1>
          <p className="mb-2">Name: John Doe</p>
          <p className="mb-2">Title: Frontend Developer</p>
          <p className="mb-4">Email: john.doe@example.com</p>

          <h2 className="text-md font-bold mb-2">Skills:</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>React</li>
            <li>TypeScript</li>
            <li>CSS/Tailwind</li>
            <li>JavaScript</li>
            <li>UI/UX Design</li>
          </ul>

          <h2 className="text-md font-bold mb-2">About Me:</h2>
          <p className="mb-4">
            I'm a passionate frontend developer with 5 years of experience
            building responsive and user-friendly web applications. I enjoy
            working with modern technologies while appreciating the nostalgia of
            classic interfaces.
          </p>

          <h2 className="text-md font-bold mb-2">Contact:</h2>
          <p>GitHub: github.com/johndoe</p>
          <p>LinkedIn: linkedin.com/in/johndoe</p>
        </div>
      ),
      isOpen: false,
      isMinimized: false,
      zIndex: 0,
      position: { x: 50, y: 50 },
      size: { width: 500, height: 400 },
    },
    {
      id: "resume",
      title: "resume.doc - Document Viewer",
      type: "document",
      content: (
        <div className="p-2 font-mono text-sm">
          <h1 className="text-lg font-bold mb-4 text-center">RESUME</h1>

          <h2 className="text-md font-bold mb-2">JOHN DOE</h2>
          <p className="mb-4">
            Frontend Developer | john.doe@example.com | (555) 123-4567
          </p>

          <h2 className="text-md font-bold mb-2">EXPERIENCE</h2>
          <div className="mb-3">
            <p className="font-bold">Senior Frontend Developer</p>
            <p>Tech Company Inc. | 2020 - Present</p>
            <ul className="list-disc pl-5">
              <li>Developed responsive web applications using React</li>
              <li>
                Implemented UI/UX improvements resulting in 25% increase in user
                engagement
              </li>
              <li>Led a team of 3 junior developers</li>
            </ul>
          </div>

          <div className="mb-3">
            <p className="font-bold">Frontend Developer</p>
            <p>Web Solutions LLC | 2018 - 2020</p>
            <ul className="list-disc pl-5">
              <li>
                Built interactive user interfaces with JavaScript and React
              </li>
              <li>
                Collaborated with designers to implement pixel-perfect designs
              </li>
            </ul>
          </div>

          <h2 className="text-md font-bold mb-2">EDUCATION</h2>
          <p className="font-bold">Bachelor of Science in Computer Science</p>
          <p>University of Technology | 2014 - 2018</p>
        </div>
      ),
      isOpen: false,
      isMinimized: false,
      zIndex: 0,
      position: { x: 100, y: 100 },
      size: { width: 550, height: 450 },
    },
    {
      id: "projects",
      title: "projects.txt - Notepad",
      type: "notepad",
      content: (
        <div className="p-2 font-mono text-sm">
          <h1 className="text-lg mb-4">My Projects</h1>

          <div className="mb-4">
            <h2 className="text-md font-bold">Windows 98 Portfolio</h2>
            <p className="mb-1">
              A nostalgic portfolio website built with React and Vite
            </p>
            <p className="mb-1">
              Technologies: React, TypeScript, 98.css, Tailwind
            </p>
            <p>github.com/johndoe/win98-portfolio</p>
          </div>

          <div className="mb-4">
            <h2 className="text-md font-bold">E-commerce Dashboard</h2>
            <p className="mb-1">
              Admin dashboard for managing online store inventory
            </p>
            <p className="mb-1">Technologies: React, Redux, Material UI</p>
            <p>github.com/johndoe/ecommerce-dashboard</p>
          </div>

          <div className="mb-4">
            <h2 className="text-md font-bold">Weather App</h2>
            <p className="mb-1">
              Real-time weather application with location services
            </p>
            <p className="mb-1">Technologies: JavaScript, OpenWeather API</p>
            <p>github.com/johndoe/weather-app</p>
          </div>
        </div>
      ),
      isOpen: false,
      isMinimized: false,
      zIndex: 0,
      position: { x: 150, y: 150 },
      size: { width: 500, height: 400 },
    },
  ]);

  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(0);

  // Desktop icons configuration
  const desktopIcons = [
    {
      id: "portfolio",
      label: "Portfolio.txt",
      iconSrc: "https://win98icons.alexmeub.com/icons/png/notepad-0.png",
    },
    {
      id: "resume",
      label: "Resume.doc",
      iconSrc: "https://win98icons.alexmeub.com/icons/png/document-0.png",
    },
    {
      id: "projects",
      label: "Projects.txt",
      iconSrc: "https://win98icons.alexmeub.com/icons/png/notepad-1.png",
    },
  ];

  // Simulate Windows 98 boot screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBootScreen(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle opening a window
  const handleOpenWindow = (id: string) => {
    setWindows((prevWindows) => {
      const newZIndex = highestZIndex + 1;
      setHighestZIndex(newZIndex);
      setActiveWindowId(id);

      return prevWindows.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            isOpen: true,
            isMinimized: false,
            zIndex: newZIndex,
          };
        }
        return window;
      });
    });
  };

  // Function to handle closing a window
  const handleCloseWindow = (id: string) => {
    setWindows((prevWindows) => {
      return prevWindows.map((window) => {
        if (window.id === id) {
          return { ...window, isOpen: false };
        }
        return window;
      });
    });

    // If the closed window was active, set activeWindowId to null
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  // Function to handle minimizing a window
  const handleMinimizeWindow = (id: string) => {
    setWindows((prevWindows) => {
      return prevWindows.map((window) => {
        if (window.id === id) {
          return { ...window, isMinimized: true };
        }
        return window;
      });
    });
  };

  // Function to handle bringing a window to front
  const handleFocusWindow = (id: string) => {
    setWindows((prevWindows) => {
      const newZIndex = highestZIndex + 1;
      setHighestZIndex(newZIndex);
      setActiveWindowId(id);

      return prevWindows.map((window) => {
        if (window.id === id) {
          return { ...window, zIndex: newZIndex, isMinimized: false };
        }
        return window;
      });
    });
  };

  // Function to handle window position update
  const handleUpdatePosition = (
    id: string,
    position: { x: number; y: number },
  ) => {
    setWindows((prevWindows) => {
      return prevWindows.map((window) => {
        if (window.id === id) {
          return { ...window, position };
        }
        return window;
      });
    });
  };

  // Function to handle icon double click
  const handleIconDoubleClick = (id: string) => {
    // Play sound effect
    const audio = new Audio(
      "https://www.myinstants.com/media/sounds/windows-98-startup.mp3",
    );
    audio.volume = 0.2;
    audio.play().catch((e) => console.log("Error playing sound:", e));

    handleOpenWindow(id);
  };

  // Function to handle start button click
  const handleStartClick = () => {
    console.log("Start menu clicked");
  };

  // Function to toggle start menu
  const handleStartMenuToggle = () => {
    setShowStartMenu(!showStartMenu);
  };

  // Close start menu when clicking elsewhere
  const handleDesktopClick = () => {
    if (showStartMenu) {
      setShowStartMenu(false);
    }
  };

  if (showBootScreen) {
    return (
      <div
        className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white"
        style={{ fontFamily: "MS Sans Serif, sans-serif" }}
      >
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mb-4">
            <div className="text-white text-4xl font-bold">⊞</div>
          </div>
        </div>
        <div className="text-xl mb-2 font-bold">Microsoft Windows 98</div>
        <div className="text-sm mb-8">
          Copyright © 1981-1998 Microsoft Corp.
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          <div className="text-sm">Starting Windows...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden relative cursor-default"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80'), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4"><rect width="4" height="4" fill="%23008080"/><rect width="2" height="2" fill="%23006666"/><rect x="2" y="2" width="2" height="2" fill="%23006666"/></svg>')`,
        backgroundSize: "cover, 4px 4px",
        backgroundPosition: "center, 0 0",
        backgroundBlendMode: "multiply",
        fontFamily: "MS Sans Serif, sans-serif, system-ui",
      }}
      onClick={handleDesktopClick}
    >
      {/* Desktop Background with classic pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 128, 128, 0.1)",
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2"><rect width="1" height="1" fill="%23ffffff" opacity="0.05"/><rect x="1" y="1" width="1" height="1" fill="%23ffffff" opacity="0.05"/></svg>')`,
          backgroundSize: "2px 2px",
        }}
      >
        {/* Desktop Icons */}
        <div className="absolute top-4 left-4 space-y-6">
          {desktopIcons.map((icon, index) => (
            <DesktopIcon
              key={icon.id}
              icon={icon.iconSrc}
              label={icon.label}
              onClick={() => handleIconDoubleClick(icon.id)}
              position={{ x: 0, y: index * 80 }}
            />
          ))}
        </div>

        {/* Windows */}
        {windows.map(
          (window) =>
            window.isOpen &&
            !window.isMinimized && (
              <Window
                key={window.id}
                title={window.title}
                isOpen={window.isOpen}
                onClose={() => handleCloseWindow(window.id)}
                onMinimize={() => handleMinimizeWindow(window.id)}
                onFocus={() => handleFocusWindow(window.id)}
                initialPosition={window.position}
                initialSize={window.size}
                zIndex={window.zIndex}
              >
                {window.content}
              </Window>
            ),
        )}
      </div>

      {/* Taskbar */}
      <Taskbar
        openWindows={windows
          .filter((w) => w.isOpen)
          .map((w) => ({
            id: w.id,
            title: w.title,
            isActive: activeWindowId === w.id,
          }))}
        onWindowSelect={handleFocusWindow}
        onStartClick={handleStartClick}
        showStartMenu={showStartMenu}
        onStartMenuToggle={handleStartMenuToggle}
      />
    </div>
  );
};

export default Home;
