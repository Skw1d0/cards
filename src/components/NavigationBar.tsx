import {
  Close,
  DarkMode,
  Home,
  LightMode,
  Menu,
  Settings,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../App";

export const NavigartionBar = () => {
  const appContext = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Stack
              sx={{ alignItems: "center", width: "100%" }}
              direction={"row"}
              spacing={1}
            >
              <IconButton onClick={toggleDrawer(true)}>
                <Menu sx={{ color: "white" }} />
              </IconButton>
              <Typography sx={{ marginRight: 1, flexGrow: 1 }}>
                Cards
              </Typography>
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
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: { xs: "100vw", sm: 300 } }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <Typography flexGrow={1} />
              <IconButton onClick={toggleDrawer(false)}>
                <Close />
              </IconButton>
            </ListItem>
            <ListItemButton onClick={() => appContext?.setPage("cards")}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={() => appContext?.setPage("settings")}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText>Einstellungen</ListItemText>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
