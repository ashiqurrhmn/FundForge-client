"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50 }}
        className="w-12 h-12 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg" 
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50 }}
      className="flex items-center justify-center w-12 h-12 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all hover:scale-110 shadow-lg text-neutral-600 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
      aria-label="Toggle theme"
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
