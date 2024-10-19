import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
import { Cancel, Category, Delete, Edit, Save } from "@mui/icons-material";

export const Categories = () => {
  const { categories, createCategory, deleteCategorey, changeCategoryName } =
    useCategoriesStore();
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
            <CardHeader
              sx={{ color: "primary.main" }}
              title="Neue Kategorie"
              subheader="Lege eine neue Kategorie an."
            />
            <CardContent>
              {/* <Typography color="primary" variant="overline" component={"h6"}>
                Neue Kategorie anlegen
              </Typography> */}
              <List>
                <ListItem>
                  <ListItemText>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        fullWidth
                        id="add-category"
                        label="Kategoriename"
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
            <CardHeader
              sx={{ color: "primary.main" }}
              title="Kategorie wählen"
              subheader="Wähle eine Kategorie, die du üben oder bearbeiten willst."
            />
            <CardContent>
              <List>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <ListItem divider key={category.id}>
                      {editCategoryID === category.id ? (
                        <>
                          <ListItemText>
                            <FormControl fullWidth>
                              <TextField
                                value={editCategoryValue}
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>
                                ) => setEditCategoryValue(event.target.value)}
                              />
                            </FormControl>
                          </ListItemText>
                          <Stack direction={"row"}>
                            <IconButton
                              onClick={() =>
                                handleSaveCategory(
                                  category.id,
                                  editCategoryValue
                                )
                              }
                            >
                              <Save />
                            </IconButton>
                            <IconButton onClick={() => setEditCategoryID("")}>
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
                  ))
                ) : (
                  <Typography>Keine Kategorie vorhanden</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};
