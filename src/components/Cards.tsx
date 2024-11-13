import { Delete, Edit, Home } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Link,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useCategoriesStore } from "../stores/storeCategories";
import React, { useEffect } from "react";

export const Cards = () => {
  const { getCards, getCategoryByID, getSubcategoryByID, deleteCard } =
    useCategoriesStore();
  const { categoryID, subcategoryID } = useParams();
  const navigate = useNavigate();

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
  };

  const cards = () => {
    if (!categoryID) return;
    if (!subcategoryID) return;

    return getCards(categoryID, false, false, subcategoryID).map((card) => (
      <Card className="card" key={card.id}>
        <CardHeader title={card.question} />
        <CardContent>
          <Typography>
            {card.answer.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        </CardContent>
        <CardActions>
          <Typography flexGrow={1} />
          <IconButton
            onClick={() =>
              navigate(
                `/manage-card/${categoryID}/${subcategoryID}/edit/${card.id}`
              )
            }
          >
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDeleteCard(card.id)}>
            <Delete />
          </IconButton>
        </CardActions>
      </Card>
    ));
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="content-container">
      <div className="card" style={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <IconButton color="primary" onClick={() => navigate("/")}>
            <Home />
          </IconButton>
          <Link
            onClick={() => navigate("/subcategories/" + categoryID)}
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            {getCategoryByID(categoryID)?.name}
          </Link>
          <Typography>{getSubcategoryByID(subcategoryID)?.name}</Typography>
        </Breadcrumbs>
      </div>
      {cards()}
      <Box>
        <Button
          onClick={() =>
            navigate(`/manage-card/${categoryID}/${subcategoryID}`)
          }
        >
          Neue Karteikarte erstellen
        </Button>
      </Box>
    </div>
  );
};
