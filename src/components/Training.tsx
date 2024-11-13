import { Home } from "@mui/icons-material";
import {
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  LinearProgress,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card as CardType,
  useCategoriesStore,
} from "../stores/storeCategories";
import React, { useState } from "react";

export const Training = () => {
  const { categoryID, subcategoryID } = useParams();
  const { getCategoryByID, getSubcategoryByID, getCards, addCardStatistic } =
    useCategoriesStore();
  const navigate = useNavigate();

  const [noRating, setNoRating] = useState(false);
  const [shuffleCards, setShuffleCards] = useState(true);
  const [preferredWrongCards, setPreferredWrongCards] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cardIsCoverd, setCardIsCoverd] = useState(true);

  const handleStartTraining = () => {
    if (!categoryID) return;
    setCards(
      getCards(categoryID, shuffleCards, preferredWrongCards, subcategoryID)
    );
    setCurrentCard(0);
    setIsTraining(true);
  };

  const handleResetTraining = () => {
    setProgress(0);
    setCurrentCard(0);
    setCardIsCoverd(true);
    setCards([]);
    setIsTraining(false);
  };

  const handleNextCard = (isCorrect: boolean) => {
    if (!noRating) {
      addCardStatistic(cards[currentCard].id, Date.now(), isCorrect);
    }

    if (currentCard === cards.length - 1) {
      setIsTraining(false);
      return;
    }

    setProgress(Math.floor((100 / cards.length) * (currentCard + 1)));
    setCurrentCard(currentCard + 1);
    setCardIsCoverd(true);
  };

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

      {!isTraining && (
        <Card className="card">
          <CardHeader
            title="Karteikarten lernen"
            subheader="Wähle deine Optionen."
          />
          <CardContent>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noRating}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setNoRating(event.target.checked)
                    }
                  />
                }
                label="Durchlauf ohne Wertung"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shuffleCards}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setShuffleCards(event.target.checked)
                    }
                  />
                }
                label="Zufällige Abfrage der Karten"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferredWrongCards}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setPreferredWrongCards(event.target.checked)
                    }
                  />
                }
                label="Bevorzugt Karten abfragen, die ich nicht richtig beantwortet habe. (Beta)"
              />
            </FormGroup>
          </CardContent>
          <CardActions>
            <Typography flexGrow={1} />
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleStartTraining()}
            >
              Starten
            </Button>
            <Button
              color="primary"
              onClick={() => navigate(`/subcategories/${categoryID}`)}
            >
              Abbrechen
            </Button>
          </CardActions>
        </Card>
      )}

      {isTraining && (
        <>
          <Card className="card">
            <CardHeader subheader="Beantworte die Fragen." />
            <CardContent>
              <Stack>
                <Stack direction={"row"}>
                  <Typography>Fortschritt:</Typography>
                  <Typography flexGrow={1} />
                  <Typography>
                    {currentCard + 1} / {cards.length}
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={progress} />
              </Stack>
            </CardContent>
            <CardActions>
              <Typography flexGrow={1} />
              <Button color="error" onClick={() => handleResetTraining()}>
                Abbrechen
              </Button>
            </CardActions>
          </Card>
          <Card className="card">
            <CardHeader title={cards[currentCard]?.question} />
            <CardContent sx={{ height: "150px" }}>
              {cardIsCoverd ? (
                <>
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </>
              ) : (
                <Typography>
                  {cards[currentCard]?.answer.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              {cardIsCoverd ? (
                <>
                  <Typography flexGrow={1} />
                  <Button
                    variant="contained"
                    onClick={() => setCardIsCoverd(false)}
                  >
                    Aufdecken
                  </Button>
                </>
              ) : (
                <>
                  <Typography flexGrow={1} />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleNextCard(true)}
                  >
                    Richtig
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleNextCard(false)}
                  >
                    Falsch
                  </Button>
                </>
              )}
            </CardActions>
          </Card>
        </>
      )}
    </div>
  );
};
