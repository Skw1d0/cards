import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  useCategoriesStore,
  Card as CardStore,
} from "../stores/storeCategories";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { Quiz } from "@mui/icons-material";
import { DashboardNoSubcategory } from "./DashboardNoSubcategory";

export const Test = () => {
  const { getCategoryByID, getCards, addCardStatistic } = useCategoriesStore();
  const [isTesting, setIsTesting] = useState(false);

  const [progress, setPorgress] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [cards, setCards] = useState<CardStore[]>([]);
  const [isCardCoverd, setIsCardCoverd] = useState(true);
  const [shuffle, setShuffle] = useState(false);

  const appContext = useContext(AppContext);

  const handleStartTest = (subcategory?: string) => {
    if (!appContext?.selectedCategoryID) return;
    const newCards: CardStore[] = getCards(
      appContext?.selectedCategoryID,
      subcategory,
      shuffle
    );

    if (!newCards.length) return;

    setCards(newCards);
    setCurrentCard(0);
    setIsTesting(true);
  };

  useEffect(() => {
    setPorgress(Math.floor((100 / cards.length) * (currentCard + 1)));
    setIsCardCoverd(true);
  }, [cards, currentCard, progress]);

  const handleNextCard = (correct: boolean) => {
    addCardStatistic(cards[currentCard].id, Date.now(), correct);

    if (currentCard === cards.length - 1) {
      setIsTesting(false);
      return;
    }

    setIsCardCoverd(true);
    setCurrentCard(currentCard + 1);
    setPorgress(Math.floor((100 / cards.length) * (currentCard + 1)));
  };

  const getSubcategoryLength = (): number => {
    if (appContext?.selectedCategoryID) {
      const length = getCategoryByID(appContext?.selectedCategoryID)
        ?.subcategories.length;
      if (length) {
        return length;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  return (
    <>
      {getSubcategoryLength() === 0 ? (
        <DashboardNoSubcategory />
      ) : !isTesting ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          <Box sx={{ width: { xs: "100%", sm: 500 } }}>
            <Card>
              <CardHeader
                sx={{ color: "primary.main" }}
                title="Einstellungen"
                subheader="Welche Einstellungen möchtest du für diesen Test verwenden?"
              />
              <CardContent>
                <Box sx={{ marginBottom: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={shuffle}
                        onClick={() => setShuffle(!shuffle)}
                      />
                    }
                    label="Zufällige Abfrage der Karten"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: { xs: "100%", sm: 500 } }}>
            <Card>
              <CardHeader
                sx={{ color: "primary.main" }}
                title="Wähle deine Kategorie"
                subheader="Welche Kategorie möchtest du üben? Wähle 'Alle Kategorien' um alle Karten zu üben."
              />
              <CardContent>
                <List>
                  <ListItemButton divider onClick={() => handleStartTest()}>
                    <ListItemIcon>
                      <Quiz />
                    </ListItemIcon>
                    <ListItemText>Alle Kategorien</ListItemText>
                  </ListItemButton>

                  {appContext?.selectedCategoryID &&
                    getCategoryByID(
                      appContext?.selectedCategoryID
                    )?.subcategories.map(
                      (category) =>
                        category.cards.length > 0 && (
                          <ListItemButton
                            divider
                            key={category.id}
                            onClick={() => {
                              handleStartTest(category.id);
                            }}
                          >
                            <ListItemIcon>
                              <Quiz />
                            </ListItemIcon>
                            <ListItemText>{category.name}</ListItemText>
                          </ListItemButton>
                        )
                    )}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          <Box sx={{ width: { xs: "100%", sm: 500 } }}>
            <Card>
              <CardHeader
                sx={{ color: "primary.main" }}
                title="Test läuft..."
                subheader="Beantworte die Fragen."
              />
              <CardContent>
                <Stack direction={"column"} sx={{ marginBottom: 2 }}>
                  <Typography sx={{ textAlign: "right" }}>
                    {currentCard + 1} / {cards.length}
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "right", marginRight: 1 }}>
                <Button color="error" onClick={() => setIsTesting(false)}>
                  Test Abbrechen
                </Button>
              </CardActions>
            </Card>
          </Box>
          <Box sx={{ width: { xs: "100%", sm: 500 } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  {cards[currentCard]?.question}
                </Typography>
                {isCardCoverd ? (
                  <Skeleton variant="rounded" width={"100%"} height={80} />
                ) : (
                  <Typography width={"100%"} height={80}>
                    {cards[currentCard]?.answer}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ marginBottom: 1, marginRight: 1 }}>
                {!isCardCoverd ? (
                  <>
                    <Typography sx={{ flexGrow: 1 }} />
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ width: 100 }}
                      onClick={() => handleNextCard(true)}
                    >
                      Richtig
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ width: 100 }}
                      onClick={() => handleNextCard(false)}
                    >
                      Falsch
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography sx={{ flexGrow: 1 }} />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ width: 208 }}
                      onClick={() => setIsCardCoverd(false)}
                    >
                      Aufdecken
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Box>
        </Box>
      )}
    </>
  );
};
