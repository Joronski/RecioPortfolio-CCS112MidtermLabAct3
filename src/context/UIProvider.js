import React, { createContext, useContext, useState, useCallback } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [theme, setTheme] = useState("cyber"); // 'cyber' | 'minimal'
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "cyber" ? "minimal" : "cyber"));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((d) => !d);
  }, []);

  return (
    <UIContext.Provider
      value={{
        theme,
        darkMode,
        activeCategory,
        toggleTheme,
        toggleDarkMode,
        setActiveCategory,
      }}
    >
      <div
        data-theme={theme}
        data-mode={darkMode ? "dark" : "light"}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </div>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
};