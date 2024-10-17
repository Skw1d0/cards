import { createTheme } from "@mui/material/styles";

export const dark = createTheme({
  palette: {
    mode: "dark", // Aktiviert den Dark Mode
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // backgroundColor: "#333333", // Setze hier die gewünschte Hintergrundfarbe
        },
      },
    },
  },
});

export const light = createTheme({
  palette: {
    mode: "light", // Aktiviert den Dark Mode
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // backgroundColor: "#cccccc", // Setze hier die gewünschte Hintergrundfarbe
        },
      },
    },
  },
});
