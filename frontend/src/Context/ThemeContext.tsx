import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ThemeContextProp {
  display: "dark" | "light";
  setDisplay: (mode: "dark" | "light") => void;
}

interface ThemeContextProviderProp {
  children: React.ReactNode;
}

const themeContext = React.createContext<ThemeContextProp>({
  display: "light",
  setDisplay: () => {},
});

export const useThemeContext = () => {
  return React.useContext(themeContext);
};

export const ThemeContextProvider: React.FC<ThemeContextProviderProp> = ({
  children,
}) => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const {pathname} = useLocation()
  const getThemeMode = localStorage.getItem("display") as "dark" | "light";
  const [mode, setMode] = React.useState<"dark" | "light">(getThemeMode);

  useEffect(() => {
    if (isDarkMode && !getThemeMode && pathname !== "/login" && pathname !== "/register") {
      setMode("dark");
    } else if (pathname === "/register" || pathname === "/login") {
      setMode("light");
    }
  }, [isDarkMode, pathname, getThemeMode]);
  

  useEffect(() => {
    if (mode === "dark") {
      localStorage.setItem("display", "dark");
      document.body.classList.add("dark");
    } else if (mode === "light") {
      localStorage.setItem("display", "light");
      document.body.classList.remove("dark");
    }
  }, [mode]);

  return (
    <themeContext.Provider
      value={{ display: mode, setDisplay: (modeType) => setMode(modeType) }}
    >
      {children}
    </themeContext.Provider>
  );
};
