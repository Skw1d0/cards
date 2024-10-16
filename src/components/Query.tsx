import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  LinearProgress,
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

export const Query = () => {
  const { getCategoryByID, getCards } = useCategoriesStore();
  const [isTesting, setIsTesting] = useState(false);

  const [progress, setPorgress] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [cards, setCards] = useState<CardStore[]>([]);
  const [isCardCoverd, setIsCardCoverd] = useState(true);

  const appContext = useContext(AppContext);

  const handleStartTest = (subcategory?: string) => {
    if (!appContext?.selectedCategoryID) return;

    const newCards: CardStore[] = getCards(
      appContext?.selectedCategoryID,
      subcategory
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

  const handleNextCard = (answerCorrect: boolean) => {
    if (currentCard === cards.length - 1) {
      setIsTesting(false);
      return;
    }

    setIsCardCoverd(true);
    setCurrentCard(currentCard + 1);
    setPorgress(Math.floor((100 / cards.length) * (currentCard + 1)));
  };

  return (
    <>
      {!isTesting ? (
        <Card sx={{ width: { xs: "100%", sm: 500 }, marginBottom: 2 }}>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Wissen abfragen"
            subheader="Wähle eine Unterkategorie."
          />
          <CardContent>
            <Stack direction={"column"} spacing={1}>
              <Button
                sx={{ height: 80 }}
                variant="contained"
                onClick={() => handleStartTest()}
              >
                Alle
              </Button>
              {appContext?.selectedCategoryID &&
                getCategoryByID(
                  appContext?.selectedCategoryID
                )?.subcategories.map(
                  (category) =>
                    category.cards.length > 0 && (
                      <Button
                        key={category.id}
                        sx={{ height: 80 }}
                        variant="contained"
                        onClick={() => {
                          handleStartTest(category.id);
                        }}
                      >
                        {category.name}
                      </Button>
                    )
                )}
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ width: { xs: "100%", sm: 500 }, marginBottom: 2 }}>
          <CardHeader sx={{ color: "primary.main" }} title="Abfrage läuft..." />
          <CardContent sx={{ height: 300 }}>
            <Stack direction={"column"} sx={{ marginBottom: 2 }}>
              <Typography sx={{ textAlign: "right" }}>
                {currentCard + 1} / {cards.length}
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Stack>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
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
          </CardContent>
          <CardActions>
            <Typography sx={{ flexGrow: 1 }} />
            <Button color="error" onClick={() => setIsTesting(false)}>
              Abbrechen
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
};
