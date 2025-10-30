import { create} from 'zustand';

export const useThemeStore=create((set)=>({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme:(theme)=>{
        localStorage.setItem("chat-theme",theme);
        set({theme});
      document.documentElement.setAttribute("data-theme", theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
    },
}));