"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { ThemeSwitcher } from "./ThemeSwitcher";

type ThemeValue = "light" | "dark" | "system";

export function ThemeToogle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isValidTheme = (value: string | undefined): value is ThemeValue => {
    return value === "light" || value === "dark" || value === "system";
  };

  // Get the current theme, defaulting to "light" if undefined
  const currentTheme = theme || "light";
  const safeTheme: ThemeValue = isValidTheme(currentTheme)
    ? currentTheme
    : "light";

  const handleThemeChange = React.useCallback(
    (newTheme: ThemeValue) => {
      setTheme(newTheme);
    },
    [setTheme]
  );

  if (!mounted) {
    return null;
  }

  return (
    <ThemeSwitcher
      defaultValue="light"
      onChange={handleThemeChange}
      value={safeTheme}
    />
  );
}
