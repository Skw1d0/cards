import {
  Box,
  Button,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../App";
import { DashboardContext } from "./Dashboard";
import { useCategoriesStore } from "../stores/storeCategories";
import {
  Close,
  Dashboard,
  Description,
  Folder,
  KeyboardArrowDown,
  NoteAdd,
  PsychologyAlt,
} from "@mui/icons-material";

export const DashboradNavigation = () => {
  const appContext = useContext(AppContext);
  const dashboardContext = useContext(DashboardContext);
  const { getCategoryByID } = useCategoriesStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2 }} direction={"row"}>
        <Button onClick={handleClick} endIcon={<KeyboardArrowDown />}>
          {appContext?.selectedCategoryID &&
            getCategoryByID(appContext?.selectedCategoryID)?.name}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={() => {
            appContext?.setSelectedCategoryID(undefined);
          }}
        >
          <Close />
        </IconButton>
      </Stack>

      <Menu
        id="subcategory-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuList>
          <ListItemButton
            divider
            onClick={() => {
              dashboardContext?.setDeschboardType(undefined);
              handleClose();
            }}
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </ListItemButton>

          <ListItemButton
            divider
            onClick={() => {
              dashboardContext?.setDeschboardType("query");
              handleClose();
            }}
          >
            <ListItemIcon>
              <PsychologyAlt />
            </ListItemIcon>
            <ListItemText>Wissen testen</ListItemText>
          </ListItemButton>

          {/* <ListItemButton
            onClick={() => {
              dashboardContext?.setDeschboardType("add-cards");
              handleClose();
            }}
          >
            <ListItemIcon>
              <NoteAdd />
            </ListItemIcon>
            <ListItemText>Karteikarten hinzufügen</ListItemText>
          </ListItemButton> */}

          <ListItemButton
            onClick={() => {
              dashboardContext?.setDeschboardType("edit-cards");
              handleClose();
            }}
          >
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText>Karteikarten verwalten</ListItemText>
          </ListItemButton>
          <ListItemButton
            divider
            onClick={() => {
              dashboardContext?.setDeschboardType("edit-subcategories");
              handleClose();
            }}
          >
            <ListItemIcon>
              <Folder />
            </ListItemIcon>
            <ListItemText>Unterkategorien verwalten</ListItemText>
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              appContext?.setSelectedCategoryID(undefined);
            }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <Close />
            </ListItemIcon>
            <Typography sx={{ color: "error.main" }}>Schließen</Typography>
          </ListItemButton>
        </MenuList>
      </Menu>
    </>
  );
};
