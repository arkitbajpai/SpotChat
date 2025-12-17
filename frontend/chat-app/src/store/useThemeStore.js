import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",

  setTheme: (theme) => {
    // ✅ APPLY THE THEME TO DAISYUI
    document.documentElement.setAttribute("data-theme", theme);

    // persist
    localStorage.setItem("chat-theme", theme);

    set({ theme });
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem("chat-theme") || "coffee";
    document.documentElement.setAttribute("data-theme", savedTheme);
    set({ theme: savedTheme });
  },
}));
