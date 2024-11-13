import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card as CardType,
  useCategoriesStore,
} from "../stores/storeCategories";
import { v4 } from "uuid";
import { RestartAlt } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";
import { getCardStatistics, CardDataType } from "../tools/getCardStatistics";

export const ManageCard = () => {
  const { categoryID, subcategoryID, cardID } = useParams();
  const { getCardByID, changeCard, addCard, deleteCardStatistics } =
    useCategoriesStore();

  const card = getCardByID(cardID);
  const [question, setQuestion] = useState(card?.question || "");
  const [answer, setAnswer] = useState(card?.answer || "");

  const [chartData, setChartData] = useState<CardDataType>({
    labels: [],
    correct: [],
    incorrect: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (card) {
      setChartData(getCardStatistics(card));
    }
  }, [card, setChartData]);

  const handleChangeQuestion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleChangeAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const handleResetCardStatistics = (id: string) => {
    deleteCardStatistics(id);
  };

  const handleSaveCard = () => {
    if (cardID) {
      changeCard(cardID, question, answer);
      return navigate(`/cards/${categoryID}/${subcategoryID}`);
    } else {
      const newCard: CardType = {
        id: v4(),
        question: question,
        answer: answer,
        time: Date.now(),
        statistics: [],
      };
      if (!subcategoryID) return;
      addCard(subcategoryID, newCard);
      setQuestion("");
      setAnswer("");
      inputRef.current?.focus();
    }
  };

  const getAllCardStatistics = (cardID: string, isCorrect: boolean): number => {
    const card = getCardByID(cardID);
    if (!card) return 0;

    if (isCorrect)
      return card.statistics.filter((statistic) => statistic.correct === true)
        .length;
    if (!isCorrect)
      return card.statistics.filter((statistic) => statistic.correct === false)
        .length;

    return 0;
  };

  return (
    <div className="content-container">
      <Card className="card">
        {cardID ? (
          <CardHeader
            title={`Karteikarte bearbeiten`}
            subheader="Hier kannst du deine Karteikarte ändern."
          />
        ) : (
          <CardHeader
            title="Neue Karteikarte erstellen"
            subheader="Erstelle eine neue Karteikarte, indem du eine Frage und einen Antwort eingibst."
          />
        )}
        <CardContent>
          <FormControl fullWidth sx={{ gap: 2 }}>
            <TextField
              autoFocus={!card}
              type="text"
              label="Frage"
              inputRef={inputRef}
              value={question}
              onChange={handleChangeQuestion}
            />
            <TextField
              multiline
              rows={4}
              label="Antwort"
              onChange={handleChangeAnswer}
              value={answer}
            />
          </FormControl>

          {card && (
            <Card variant="outlined" sx={{ marginTop: 2 }}>
              <CardHeader subheader="Kartenstatistik" />
              <CardContent>
                <Stack direction={"column"}>
                  <Stack direction={"row"}>
                    <Typography flexGrow={1}>Erstellungsdatum:</Typography>
                    <Typography>
                      {new Date(card.time).toLocaleString()} Uhr
                    </Typography>
                  </Stack>
                  <Divider
                    orientation="horizontal"
                    flexItem
                    sx={{ marginTop: 1, marginBottom: 1 }}
                  />
                  <Stack direction={"row"}>
                    <Typography flexGrow={1}>Gefragt:</Typography>
                    <Typography>{card.statistics.length}</Typography>
                  </Stack>
                  <Stack direction={"row"}>
                    <Typography flexGrow={1}>Richtig beantwortet:</Typography>
                    <Typography>
                      {getAllCardStatistics(card.id, true)}
                    </Typography>
                  </Stack>
                  <Stack direction={"row"}>
                    <Typography flexGrow={1}>Falsch beantwortet:</Typography>
                    <Typography>
                      {getAllCardStatistics(card.id, false)}
                    </Typography>
                  </Stack>
                </Stack>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={{ xs: "flex-start", md: "center" }}
                >
                  <BarChart
                    width={500}
                    height={300}
                    series={[
                      {
                        data: chartData?.correct,
                        label: "richtig",
                        id: "cId",
                        stack: "total",
                      },
                      {
                        data: chartData?.incorrect,
                        label: "falsch",
                        id: "icId",
                        stack: "total",
                      },
                    ]}
                    xAxis={[{ data: chartData?.labels, scaleType: "band" }]}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Typography flexGrow={1} />
                <Button
                  color="error"
                  startIcon={<RestartAlt />}
                  onClick={() => handleResetCardStatistics(card.id)}
                >
                  Zurücksetzen
                </Button>
              </CardActions>
            </Card>
          )}
        </CardContent>
        <CardActions>
          <Typography flexGrow={1} />
          <Button
            disabled={answer === "" || question === ""}
            variant="contained"
            onClick={() => handleSaveCard()}
          >
            Speichern
          </Button>
          <Button
            onClick={() => navigate(`/cards/${categoryID}/${subcategoryID}`)}
          >
            Abbrechen
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
