import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import { AppContext } from "../App";
import { useContext, useState } from "react";
import { Cancel, Delete, Edit, Save } from "@mui/icons-material";
import { DashboardContext } from "./Dashboard";

export const DashboardManageSubcategories = () => {
  const {
    getCategoryByID,
    createSubcategory,
    deleteSubcategory,
    changeSubcategoryName,
  } = useCategoriesStore();
  const appContext = useContext(AppContext);
  const dashboardContext = useContext(DashboardContext);

  const [subcategoryInputValue, setSubcategoryInputValue] =
    useState<string>("");
  const [editSubcategoryID, setEditSubcategoryID] = useState<string>("");
  const [editSubcategoryValue, setEditSubcategoryValue] = useState<string>("");

  return (
    <Card sx={{ width: { xs: "100%", sm: 500 } }}>
      <CardHeader
        sx={{ color: "primary.main" }}
        title="Unterkategorien bearbeiten"
        subheader="Hier hast du die Möglichkeit, Unterkategorien anzulegen, zu bearbeiten oder zu löschen."
      />
      <CardContent>
        {appContext?.selectedCategoryID &&
          getCategoryByID(appContext?.selectedCategoryID)?.subcategories?.map(
            (subcategory) => (
              <List key={subcategory.id}>
                <ListItem>
                  {editSubcategoryID === subcategory.id ? (
                    <>
                      <TextField
                        size="small"
                        sx={{ width: "100%", marginRight: 1 }}
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
                    </>
                  ) : (
                    <Stack direction={"column"} sx={{ flexGrow: 1 }}>
                      <Typography>{subcategory.name}</Typography>
                      <Typography fontSize={"small"}>
                        {subcategory.cards.length} Karteikarten
                      </Typography>
                    </Stack>
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
              </List>
            )
          )}

        <List>
          <ListItem>
            <TextField
              sx={{ width: "100%", marginRight: 1 }}
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
      </CardContent>
    </Card>
  );
};
