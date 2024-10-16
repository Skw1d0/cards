import { DarkMode, LightMode } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../App";

export const NavigartionBar = () => {
  const appContext = useContext(AppContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Stack
            sx={{ alignItems: "center", width: "100%" }}
            direction={"row"}
            spacing={1}
          >
            <Typography sx={{ marginRight: 1, flexGrow: 1 }}>Cards</Typography>
            <IconButton
              onClick={() => {
                appContext?.setIsDarkMode(!appContext.isDarkMode);
              }}
            >
              {appContext?.isDarkMode ? (
                <LightMode />
              ) : (
                <DarkMode sx={{ color: "white" }} />
              )}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
