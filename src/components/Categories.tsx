import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import { ChangeEvent, useContext, useState } from "react";
import { AppContext } from "../App";
import {
  Cancel,
  Category,
  Delete,
  Edit,
  Save,
  Warning,
} from "@mui/icons-material";

export const Categories = () => {
  const {
    categories,
    createCategory,
    deleteCategorey,
    changeCategoryName,
    reset,
  } = useCategoriesStore();
  const appContext = useContext(AppContext);

  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [editCategoryID, setEditCategoryID] = useState("");
  const [editCategoryValue, setEditCategoryValue] = useState("");

  const handleCreateCategory = () => {
    if (categoryInputValue === "") return;
    createCategory(categoryInputValue);
    setCategoryInputValue("");
  };

  const handleEditCategory = (categoryID: string, categoryName: string) => {
    setEditCategoryID(categoryID);
    setEditCategoryValue(categoryName);
  };

  const handleSaveCategory = (id: string, name: string) => {
    changeCategoryName(id, name);
    setEditCategoryValue("");
    setEditCategoryID("");
  };

  return (
    <>
      <Box sx={{ margin: 2, display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box sx={{ width: { xs: "100%", sm: 500 } }}>
          <Card>
            <CardContent>
              <Typography color="primary" variant="overline" component={"h6"}>
                Neue Kategorie anlegen
              </Typography>
              <List>
                <ListItem>
                  <ListItemText>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        fullWidth
                        size="small"
                        id="add-category"
                        label="Neue Kategorie"
                        variant="outlined"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setCategoryInputValue(event.target.value);
                        }}
                        value={categoryInputValue}
                        sx={{ flexGrow: 1, marginRight: 1 }}
                      />

                      <Button
                        sx={{ width: 150 }}
                        type="submit"
                        variant="contained"
                        onClick={handleCreateCategory}
                      >
                        Hinzufügen
                      </Button>
                    </Box>
                  </ListItemText>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: { xs: "100%", sm: 500 } }}>
          <Card>
            <CardContent>
              <Typography color="primary" variant="overline" component={"h6"}>
                Kategorie wählen
              </Typography>
              <List>
                {categories.map((category) => (
                  <ListItem divider key={category.id}>
                    {editCategoryID === category.id ? (
                      <>
                        <ListItemText>
                          <FormControl fullWidth>
                            <TextField
                              size="small"
                              value={editCategoryValue}
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>
                              ) => setEditCategoryValue(event.target.value)}
                            />
                          </FormControl>
                        </ListItemText>
                        <Stack direction={"row"}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleSaveCategory(category.id, editCategoryValue)
                            }
                          >
                            <Save />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setEditCategoryID("")}
                          >
                            <Cancel />
                          </IconButton>
                        </Stack>
                      </>
                    ) : (
                      <ListItemButton
                        onClick={() => {
                          appContext?.setSelectedCategoryID(category.id);
                        }}
                      >
                        <ListItemIcon>
                          <Category />
                        </ListItemIcon>
                        <ListItemText>{category.name}</ListItemText>
                      </ListItemButton>
                    )}

                    <IconButton
                      onClick={() => {
                        handleEditCategory(category.id, category.name);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => deleteCategorey(category.id)}>
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ justifyContent: "right", marginRight: 1 }}>
              <Button
                color="error"
                onClick={() => reset()}
                startIcon={<Warning />}
              >
                Alle Daten löschen
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </>
  );
};
