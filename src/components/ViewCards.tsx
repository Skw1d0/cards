import { Quiz } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../App";
import {
  Card as CardStore,
  useCategoriesStore,
} from "../stores/storeCategories";

export const ViewCards = () => {
  const appContext = useContext(AppContext);
  const { getCategoryByID, getCards } = useCategoriesStore();

  // const [showCards, setShowCards] = useState(false);
  const [cards, setCards] = useState<CardStore[]>([]);

  const handleStart = (id?: string, name?: string) => {
    if (!appContext?.selectedCategoryID) return;
    setCards(getCards(appContext?.selectedCategoryID, false, false, id));
  };

  const handleCancle = () => {
    setCards([]);
  };

  const getDisplayValue = (): string => {
    if (cards.length > 0) return "none";
    return "block";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 500 },
          display: { xs: getDisplayValue(), lg: "block" },
        }}
      >
        <Card>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Wähle deine Kategorie"
            subheader="Welche Kategorie möchtest du üben? Wähle 'Alle Kategorien' um alle Karten zu üben."
          />
          <CardContent>
            <List>
              <ListItemButton divider onClick={() => handleStart()}>
                <ListItemIcon>
                  <Quiz />
                </ListItemIcon>
                <ListItemText>Alle Kategorien</ListItemText>
              </ListItemButton>

              {appContext?.selectedCategoryID &&
                getCategoryByID(
                  appContext?.selectedCategoryID
                )?.subcategories.map(
                  (subcategory) =>
                    subcategory.cards.length > 0 && (
                      <ListItemButton
                        divider
                        key={subcategory.id}
                        onClick={() => handleStart(subcategory.id)}
                      >
                        <ListItemIcon>
                          <Quiz />
                        </ListItemIcon>
                        <ListItemText>{subcategory.name}</ListItemText>
                      </ListItemButton>
                    )
                )}
            </List>
          </CardContent>
        </Card>
      </Box>

      {cards.length > 0 && (
        <Box sx={{ width: { xs: "100%", sm: 500 } }}>
          <Card>
            <CardHeader
              title="Karten ansehen"
              subheader="Merke dir die Karten."
            />
            <CardActions>
              <Typography flexGrow={1} />
              <Button color="error" onClick={handleCancle}>
                Abbrechen
              </Button>
            </CardActions>
          </Card>

          <Box
            sx={{
              height: 500,
              overflow: "auto",
              marginTop: 2,
            }}
          >
            {cards.map((card) => (
              <Card key={card.id} sx={{ marginBottom: 2 }}>
                <CardHeader title={card.question} />
                <CardContent>
                  <Typography height={80}>
                    {card.answer.split("\n").map((line, index) => (
                      <>
                        {line}
                        <br />
                      </>
                    ))}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
