import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "night", // ✅ default dark

  setTheme: (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem("chat-theme") || "night"; // ✅ default dark
    document.documentElement.setAttribute("data-theme", savedTheme);
    set({ theme: savedTheme });
  },
}));