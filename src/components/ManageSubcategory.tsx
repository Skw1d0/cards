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
import { useState } from "react";

export const ManageSubcategory = () => {
  const { getSubcategoryByID, changeSubcategoryName, createSubcategory } =
    useCategoriesStore();
  const navigate = useNavigate();

  const { categoryID, subcategoryID } = useParams();
  const subcategory = getSubcategoryByID(subcategoryID);
  const [subcategoryName, setSubcategoryName] = useState(
    subcategory?.name || ""
  );

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubcategoryName(event.target.value);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveSubcategory();
    }
  };

  const handleSaveSubcategory = () => {
    if (subcategoryName && categoryID && subcategoryID === undefined) {
      createSubcategory(subcategoryName, categoryID);
      navigate("/subcategories/" + categoryID);
    }
    if (categoryID && subcategoryID && subcategoryName) {
      changeSubcategoryName(subcategoryID, subcategoryName);
      navigate("/subcategories/" + categoryID);
    }
  };

  return (
    <div className="content-container">
      <Card className="card">
        {subcategoryID ? (
          <CardHeader
            title={`Unterkategorie bearbeiten`}
            subheader="Hier kannst du den Namen der Unterkategorie ändern."
          />
        ) : (
          <CardHeader
            title="Neue Unterkategorie erstellen"
            subheader="Erstelle eine neue Unterkategorie, indem du einen Namen für die Kategorie eingibst."
          />
        )}
        <CardContent>
          <FormControl fullWidth>
            <TextField
              autoFocus
              label="Name der Unterkategorie"
              value={subcategoryName}
              onKeyDown={handleOnKeyDown}
              onChange={handleOnChange}
            />
          </FormControl>
        </CardContent>
        <CardActions>
          <Typography flexGrow={1} />
          <Button
            disabled={subcategoryName === ""}
            onClick={() => handleSaveSubcategory()}
            variant="contained"
          >
            Speichern
          </Button>
          <Button onClick={() => navigate("/subcategories/" + categoryID)}>
            Abbrechen
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
