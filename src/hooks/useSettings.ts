import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

type ThemeTypes = "auto" | "light" | "dark";

export const useSettings = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useState<ThemeTypes>("auto");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setIsDarkMode(
      theme === "auto" ? prefersDarkMode : theme === "dark" ? true : false
    );
  }, []);

  return { isDarkMode, setIsDarkMode };
};
