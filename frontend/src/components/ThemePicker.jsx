import { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const colorOptions = [
  { value: "sage", label: "Sage", hex: "#52664f" },
  { value: "ocean", label: "Ocean", hex: "#397487" },
  { value: "terracotta", label: "Terracotta", hex: "#b56c4e" },
  { value: "royal", label: "Royal blue", hex: "#5664c4" },
  { value: "violet", label: "Violet", hex: "#876bc0" },
  { value: "rose", label: "Rose", hex: "#cc6686" },
  { value: "amber", label: "Amber", hex: "#bd8112" },
  { value: "teal", label: "Teal", hex: "#29958c" },
  { value: "plum", label: "Plum", hex: "#965b89" },
  { value: "slate", label: "Slate", hex: "#64748b" },
];

function ThemePicker() {
  const { mode, setMode, color, setColor } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const nextMode = mode === "light" ? "dark" : "light";
  const activeColor = colorOptions.find((option) => option.value === color) ?? colorOptions[0];

  return (
    <div className="theme-picker" aria-label="Theme controls">
      <button
        className="theme-picker__toggle"
        type="button"
        onClick={() => setMode(nextMode)}
        aria-label={`Switch to ${nextMode} mode`}
        title={`Switch to ${nextMode} mode`}
        aria-pressed={mode === "dark"}
      >
        <span className="theme-picker__toggle-icon" aria-hidden="true">
          {mode === "light" ? (
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20.2 15.1A8.6 8.6 0 0 1 8.9 3.8 8.8 8.8 0 1 0 20.2 15.1Z" />
              <path d="M16.5 3v4M14.5 5h4M20 8v3M18.5 9.5h3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          )}
        </span>
      </button>

      <div className="theme-picker__color-control">
        <button
          className="theme-picker__color-button"
          type="button"
          onClick={() => setPaletteOpen((open) => !open)}
          aria-label="Choose theme color"
          aria-expanded={paletteOpen}
          aria-haspopup="true"
          title="Choose theme color"
        >
          <span className="theme-picker__color-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 1.2-3.1 1.6 1.6 0 0 1 1.1-2.8H17a4 4 0 0 0 4-4c0-4.5-4-8.1-9-8.1Z" />
              <circle cx="7.5" cy="10" r="1" /><circle cx="10" cy="6.8" r="1" /><circle cx="14" cy="7" r="1" /><circle cx="17" cy="10" r="1" />
            </svg>
          </span>
          <span className="theme-picker__current-swatch" style={{ "--swatch-color": activeColor.hex }} />
        </button>

        {paletteOpen && (
          <div className="theme-picker__palette" role="group" aria-label="Choose an accent color">
            {colorOptions.map((option) => (
              <button
                className="theme-picker__swatch"
                key={option.value}
                type="button"
                style={{ "--swatch-color": option.hex }}
                onClick={() => {
                  setColor(option.value);
                  setPaletteOpen(false);
                }}
                aria-label={`${option.label} color`}
                aria-pressed={color === option.value}
                title={option.label}
              >
                <span />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemePicker;
