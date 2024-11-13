import "./App.scss";
import { createContext } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { NavigartionBar } from "./components/NavigationBar";
import { light, dark } from "./themes/themes";
import { useSettingsStore } from "./stores/storeSettings";
import { Categories } from "./components/Categories";
import { PageNotFound } from "./components/PageNotFound";
import { Settings } from "./components/Settings";
import { ManageCategory } from "./components/ManageCategory";
import { Subcategories } from "./components/Subcategories";
import { ManageSubcategory } from "./components/ManageSubcategory";
import { Cards } from "./components/Cards";
import { ManageCard } from "./components/ManageCard";
import { Training } from "./components/Training";

interface AppContextProps {
  isDarkMode: boolean;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

function App() {
  const { isDarkMode } = useSettingsStore();

  return (
    <div className="App">
      <AuthProvider>
        <ThemeProvider theme={isDarkMode ? dark : light}>
          <CssBaseline />
          <AppContext.Provider
            value={{
              isDarkMode,
            }}
          >
            <BrowserRouter basename="/cards">
              <NavigartionBar />
              <Box marginTop={10}>
                <Routes>
                  <Route path="/" element={<Categories />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/manage-category" element={<ManageCategory />} />
                  <Route
                    path="/manage-category/:categoryID"
                    element={<ManageCategory />}
                  />
                  <Route
                    path="/subcategories/:categoryID"
                    element={<Subcategories />}
                  />
                  <Route
                    path="/manage-subcategory/:categoryID"
                    element={<ManageSubcategory />}
                  />
                  <Route
                    path="/manage-subcategory/:categoryID/:subcategoryID"
                    element={<ManageSubcategory />}
                  />
                  <Route
                    path="/cards/:categoryID/:subcategoryID"
                    element={<Cards />}
                  />
                  <Route
                    path="/manage-card/:categoryID/:subcategoryID"
                    element={<ManageCard />}
                  />
                  <Route
                    path="/manage-card/:categoryID/:subcategoryID/edit/:cardID"
                    element={<ManageCard />}
                  />
                  <Route
                    path="/training/:categoryID/:subcategoryID"
                    element={<Training />}
                  />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Box>
            </BrowserRouter>
          </AppContext.Provider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
