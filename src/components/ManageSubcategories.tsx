import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import { AppContext } from "../App";
import { useContext, useState } from "react";
import { Cancel, Delete, Edit, Save } from "@mui/icons-material";

export const ManageSubcategories = () => {
  const {
    getCategoryByID,
    createSubcategory,
    deleteSubcategory,
    changeSubcategoryName,
  } = useCategoriesStore();
  const appContext = useContext(AppContext);

  const [subcategoryInputValue, setSubcategoryInputValue] =
    useState<string>("");
  const [editSubcategoryID, setEditSubcategoryID] = useState<string>("");
  const [editSubcategoryValue, setEditSubcategoryValue] = useState<string>("");

  return (
    <Box sx={{ margin: 2, display: "flex", flexWrap: "wrap", gap: 3 }}>
      <Box sx={{ width: { xs: "100%", sm: 500 } }}>
        <Typography color="primary" variant="overline" component={"h6"}>
          Neue Unterkategorie anlegen
        </Typography>
        <List>
          <ListItem>
            <TextField
              sx={{ width: "100%", marginRight: 1 }}
              size="small"
              id="subcategorey"
              label="Unterkategorie"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSubcategoryInputValue(event.target.value)
              }
              value={subcategoryInputValue}
            />
            <Button
              variant="contained"
              sx={{ width: 150 }}
              onClick={() => {
                if (appContext?.selectedCategoryID && subcategoryInputValue) {
                  createSubcategory(
                    subcategoryInputValue,
                    appContext?.selectedCategoryID
                  );
                  setSubcategoryInputValue("");
                }
              }}
            >
              Hinzufügen
            </Button>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ width: { xs: "100%", sm: 500 } }}>
        <Typography color="primary" variant="overline" component={"h6"}>
          Kategorie bearbeiten
        </Typography>
        <List>
          {appContext?.selectedCategoryID &&
            getCategoryByID(appContext?.selectedCategoryID)?.subcategories?.map(
              (subcategory) => (
                <ListItem key={subcategory.id} divider>
                  {editSubcategoryID === subcategory.id ? (
                    <ListItemText>
                      <Box sx={{ display: "flex" }}>
                        <TextField
                          size="small"
                          sx={{ flexGrow: 1, marginRight: 1 }}
                          id="edit-subcategorey"
                          label="Unterkategorie bearbeiten"
                          variant="outlined"
                          value={editSubcategoryValue}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => setEditSubcategoryValue(event.target.value)}
                        />
                        <IconButton
                          onClick={() => {
                            changeSubcategoryName(
                              editSubcategoryID,
                              editSubcategoryValue
                            );
                            setEditSubcategoryID("");
                          }}
                        >
                          <Save />
                        </IconButton>
                        <IconButton onClick={() => setEditSubcategoryID("")}>
                          <Cancel />
                        </IconButton>
                      </Box>
                    </ListItemText>
                  ) : (
                    <ListItemText>
                      <Typography>{subcategory.name}</Typography>
                      <Typography fontSize={"small"}>
                        {subcategory.cards.length} Karteikarten
                      </Typography>
                    </ListItemText>
                  )}
                  <IconButton
                    onClick={() => {
                      setEditSubcategoryID(subcategory.id);
                      setEditSubcategoryValue(subcategory.name);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteSubcategory(subcategory.id)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              )
            )}
        </List>
      </Box>
    </Box>
  );
};
