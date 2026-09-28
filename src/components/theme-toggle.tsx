"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 dark:focus-visible:ring-brand-900/40 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      <Sun
        aria-hidden="true"
        className={`absolute left-1.5 h-4 w-4 text-amber-500 dark:text-amber-400 transition-opacity duration-200 ${
          isDark ? "opacity-40" : "opacity-100"
        }`}
      />
      <Moon
        aria-hidden="true"
        className={`absolute right-1.5 h-4 w-4 text-brand-300 transition-opacity duration-200 ${
          isDark ? "opacity-100" : "opacity-40"
        }`}
      />
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm shadow-black/10 ring-1 ring-black/5 transition-transform duration-200 ${
          isDark ? "translate-x-[26px] bg-slate-900" : "translate-x-1"
        }`}
      />
    </button>
  );
}
