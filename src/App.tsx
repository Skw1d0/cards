import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { NavigartionBar } from "./components/NavigationBar";
import { light, dark } from "./themes/themes";
import { createContext, useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Categories } from "./components/Categories";
import { Settings } from "./components/Settings";
import { AuthProvider } from "./context/AuthContext";

type ThemeTypes = "auto" | "light" | "dark";
type PageTypes = "cards" | "settings";

interface AppContextProps {
  isDarkMode: boolean;
  selectedCategoryID: string | undefined;
  page: PageTypes;
  setPage: (value: PageTypes) => void;
  setIsDarkMode: (value: boolean) => void;
  setSelectedCategoryID: (id: string | undefined) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme] = useState<ThemeTypes>("auto");
  const [page, setPage] = useState<PageTypes>("cards");

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
      <AuthProvider>
        <ThemeProvider theme={isDarkMode ? dark : light}>
          <CssBaseline />
          <AppContext.Provider
            value={{
              selectedCategoryID,
              setSelectedCategoryID,
              page,
              setPage,
              isDarkMode,
              setIsDarkMode,
            }}
          >
            <NavigartionBar />
            {page === "cards" && (
              <Box marginTop={10}>
                {selectedCategoryID === undefined && <Categories />}
                {selectedCategoryID !== undefined && <Dashboard />}
              </Box>
            )}
            {page === "settings" && (
              <Box marginTop={10}>
                <Settings />
              </Box>
            )}
          </AppContext.Provider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
