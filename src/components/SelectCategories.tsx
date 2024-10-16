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
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import { ChangeEvent, useContext, useState } from "react";
import { AppContext } from "../App";
import { Cancel, Delete, Edit, Save } from "@mui/icons-material";

export const SelectCategories = () => {
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
    <Box sx={{ margin: 2 }}>
      <Card sx={{ width: { xs: "100%", sm: 500 } }}>
        <CardHeader
          sx={{ color: "primary.main" }}
          title="Kategorien"
          subheader="Kategorie auswählen oder anlegen."
        />
        <CardContent>
          <List>
            <ListItem>
              <ListItemText>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    fullWidth
                    // size="small"
                    id="add-category"
                    label="Neue Kategorie"
                    variant="outlined"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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

            {categories.map((category) => (
              <ListItem key={category.id}>
                {editCategoryID === category.id ? (
                  <>
                    <ListItemText>
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          value={editCategoryValue}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setEditCategoryValue(event.target.value)
                          }
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
      </Card>
    </Box>
  );
};
