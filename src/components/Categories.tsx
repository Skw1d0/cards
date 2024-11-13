import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import { useEffect } from "react";
import { ArrowForwardIos, Delete, Edit, Share } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Categories = () => {
  const {
    categories,

    deleteCategorey,

    getCategoryByID,
  } = useCategoriesStore();
  const navigate = useNavigate();

  const handleExportCategory = (id: string) => {
    if (!id) return;

    const category = getCategoryByID(id);
    const fileData = JSON.stringify(category);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${category?.name.trim()}.json`;
    link.href = url;
    link.click();
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="content-container">
      {categories.map((category) => (
        <Card key={category.id} className="card">
          <CardHeader
            title={category.name}
            subheader={category.subcategories.length + " Unterkategorien"}
          />
          <CardActions>
            <Button
              onClick={() => {
                navigate("subcategories/" + category.id);
              }}
              variant="contained"
              endIcon={<ArrowForwardIos />}
            >
              Los geht's!
            </Button>
            <Typography sx={{ flexGrow: 1 }} />
            <IconButton
              onClick={() => {
                navigate("manage-category/" + category.id);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleExportCategory(category.id)}>
              <Share />
            </IconButton>
            <IconButton onClick={() => deleteCategorey(category.id)}>
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      <Box>
        <Button onClick={() => navigate("manage-category")}>
          Neue Kategorie erstellen
        </Button>
      </Box>
    </div>
  );
};
