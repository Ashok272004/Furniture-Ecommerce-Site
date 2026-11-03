import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const allowedModes = ["light", "dark"];
const allowedColors = [
  "sage",
  "ocean",
  "terracotta",
  "royal",
  "violet",
  "rose",
  "amber",
  "teal",
  "plum",
  "slate",
];

function getStoredChoice(key, allowedValues, fallback) {
  const savedValue = window.localStorage.getItem(key);
  return allowedValues.includes(savedValue) ? savedValue : fallback;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() =>
    getStoredChoice("furninest-mode", allowedModes, "light")
  );
  const [color, setColor] = useState(() =>
    getStoredChoice("furninest-color", allowedColors, "sage")
  );

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.color = color;
    window.localStorage.setItem("furninest-mode", mode);
    window.localStorage.setItem("furninest-color", color);
  }, [mode, color]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
