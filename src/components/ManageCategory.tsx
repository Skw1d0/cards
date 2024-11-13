import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useCategoriesStore } from "../stores/storeCategories";
import { ChangeEvent, useState } from "react";
import styled from "styled-components";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const ManageCategory = () => {
  const {
    getCategoryByID,
    changeCategoryName,
    createCategory,
    importCategory,
  } = useCategoriesStore();
  const navigate = useNavigate();

  const { categoryID } = useParams();
  const category = getCategoryByID(categoryID);
  const [categoryName, setCategoryName] = useState(category?.name || "");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(event.target.value);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveCategory();
    }
  };

  const handleSaveCategory = () => {
    if (categoryID) {
      if (categoryName) {
        changeCategoryName(categoryID, categoryName);
      }
    } else {
      if (categoryName) {
        createCategory(categoryName);
      }
    }
    navigate("/");
  };

  const handleImportCategory = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      if (importCategory(content)) {
        // setShowSnackbar(true);
        // setSnackbarMessage("Kategorie erfolgreich importiert.");
        navigate("/");
      } else {
        console.log("Fehler beim Importieren.");
        // setShowSnackbar(true);
        // setSnackbarMessage("Beim Importieren ist ein Fehler aufgetreten.");
      }
    };
    reader.readAsText(file); // Lese die Datei als Text
  };

  return (
    <div className="content-container">
      <Card className="card">
        {categoryID ? (
          <CardHeader
            title={`Kategorie bearbeiten`}
            subheader="Hier kannst du den Namen der Kategorie ändern."
          />
        ) : (
          <CardHeader
            title="Neue Kategorie erstellen"
            subheader="Erstelle eine neue Kategorie, indem du einen Namen für die Kategorie eingibst."
          />
        )}
        <CardContent>
          <FormControl fullWidth>
            <TextField
              autoFocus
              label="Name der Kategorie"
              value={categoryName}
              onKeyDown={handleOnKeyDown}
              onChange={handleOnChange}
            />
          </FormControl>
        </CardContent>
        <CardActions>
          <Typography flexGrow={1} />
          <Button
            disabled={categoryName === ""}
            onClick={() => handleSaveCategory()}
            variant="contained"
          >
            Erstellen
          </Button>
          <Button onClick={() => navigate("/")}>Abbrechen</Button>
        </CardActions>
      </Card>

      {!categoryID && (
        <Card className="card">
          <CardHeader
            title="Kategorie importieren"
            subheader="Importiere eine Kategorie mit einer JSON-Datei."
          />
          <CardContent></CardContent>
          <CardActions>
            <Typography flexGrow={1} />
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              variant="contained"
            >
              <VisuallyHiddenInput
                type="file"
                accept="application/json"
                onChange={handleImportCategory}
                multiple
              />
              Importieren
            </Button>
            <Button onClick={() => navigate("/")}>Abbrechen</Button>
          </CardActions>
        </Card>
      )}
    </div>
  );
};
