import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",

  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);

    // ⭐ THIS IS THE MOST IMPORTANT FIX
    document.documentElement.setAttribute("data-theme", theme);

    set({ theme });
  },
}));
