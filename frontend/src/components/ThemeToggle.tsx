import {
  useEffect,
  useState
} from "react";

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  return localStorage.getItem("theme") === "dark"
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] =
    useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDarkMode = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle-button"
      aria-pressed={isDarkMode}
      aria-label={
        isDarkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        isDarkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      onClick={() =>
        setTheme(isDarkMode ? "light" : "dark")
      }
    >
      {isDarkMode ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          focusable="false"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.9 4.9 1.4 1.4" />
          <path d="m17.7 17.7 1.4 1.4" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m4.9 19.1 1.4-1.4" />
          <path d="m17.7 6.3 1.4-1.4" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          focusable="false"
        >
          <path d="M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10z" />
        </svg>
      )}
    </button>
  );
}
