import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { NavigartionBar } from "./components/NavigationBar";
import { light, dark } from "./themes/themes";
import { createContext, useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Categories } from "./components/Categories";

type ThemeTypes = "auto" | "light" | "dark";

interface AppContextProps {
  isDarkMode: boolean;
  selectedCategoryID: string | undefined;
  setIsDarkMode: (value: boolean) => void;
  setSelectedCategoryID: (id: string | undefined) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme] = useState<ThemeTypes>("auto");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategoryID, setSelectedCategoryID] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    setIsDarkMode(
      theme === "auto" ? prefersDarkMode : theme === "dark" ? true : false
    );
  }, [theme, prefersDarkMode]);

  return (
    <div className="App">
      <ThemeProvider theme={isDarkMode ? dark : light}>
        <CssBaseline />
        <AppContext.Provider
          value={{
            selectedCategoryID,
            setSelectedCategoryID,
            isDarkMode,
            setIsDarkMode,
          }}
        >
          <NavigartionBar />
          <Box sx={{ marginTop: 10 }}>
            {selectedCategoryID === undefined && <Categories />}
            {selectedCategoryID !== undefined && <Dashboard />}
          </Box>
        </AppContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
