import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Card as CardStore,
  useCategoriesStore,
} from "../stores/storeCategories";
import { AppContext } from "../App";
import { ChangeEvent, useContext, useState } from "react";
import { DashboardNoSubcategory } from "./DashboardNoSubcategory";
import { ExpandMore } from "@mui/icons-material";
import { v4 } from "uuid";

export const ManageCards = () => {
  const { getCategoryByID, deleteCard, changeCard, addCard } =
    useCategoriesStore();
  const appContext = useContext(AppContext);

  const [subcategoryID, setSubcategoryID] = useState("");
  const [editCardID, setEditCardID] = useState("");
  const [newCardQuestion, setNewCardQuestion] = useState("");
  const [newCardAnswer, setNewCardAnswer] = useState("");

  const [cardQuestion, setCardQuestion] = useState("");
  const [cardAnswer, setCardAnswer] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSubcategoryID(event.target.value as string);
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

  const getCards = (): CardStore[] => {
    if (!appContext?.selectedCategoryID) return [];
    const subcategory = getCategoryByID(
      appContext?.selectedCategoryID
    )?.subcategories.filter((sub) => sub.id === subcategoryID);

    if (!subcategory) return [];

    return subcategory[0].cards;
  };

  return (
    <>
      {getSubcategoryLength() === 0 ? (
        <DashboardNoSubcategory />
      ) : (
        <Box sx={{ margin: 2, display: "flex", flexWrap: "wrap", gap: 3 }}>
          <Box sx={{ width: { xs: "100%", sm: 500 } }}>
            <Box>
              <Typography color="primary" variant="overline" component={"h6"}>
                Einstellungen
              </Typography>
              <List>
                <ListItem>
                  <FormControl fullWidth>
                    <InputLabel id="select-subcategories-label" size="small">
                      Unterkategorie
                    </InputLabel>
                    <Select
                      size="small"
                      labelId="select-subcategories-label"
                      id="subcategories-select"
                      label="Unterkategorie"
                      value={subcategoryID}
                      onChange={handleChange}
                    >
                      {appContext?.selectedCategoryID &&
                        getCategoryByID(
                          appContext.selectedCategoryID
                        )?.subcategories.map((subcategory) => (
                          <MenuItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </Box>

            {subcategoryID && (
              <Box sx={{ width: { xs: "100%", sm: 500 }, marginTop: 2 }}>
                <Typography color="primary" variant="overline" component={"h6"}>
                  Neue Karte anlegen
                </Typography>
                <List>
                  <ListItem>
                    <FormControl fullWidth sx={{ gap: 1 }}>
                      <TextField
                        sx={{ width: "100%" }}
                        size="small"
                        label="Frage"
                        variant="outlined"
                        value={cardQuestion}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setCardQuestion(event.target.value)
                        }
                      />
                      <TextField
                        multiline
                        size="small"
                        rows={4}
                        sx={{ width: "100%" }}
                        label="Antwort"
                        variant="outlined"
                        value={cardAnswer}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setCardAnswer(event.target.value)
                        }
                      />
                      <Box sx={{ display: "flex", justifyContent: "right" }}>
                        <Button
                          variant="contained"
                          disabled={
                            cardAnswer === "" ||
                            cardQuestion === "" ||
                            subcategoryID === ""
                          }
                          onClick={() => {
                            addCard(subcategoryID, {
                              id: v4(),
                              time: Date.now(),
                              question: cardQuestion,
                              answer: cardAnswer,
                              statistics: [],
                            });
                            setCardQuestion("");
                            setCardAnswer("");
                          }}
                        >
                          Speichern
                        </Button>
                      </Box>
                    </FormControl>
                  </ListItem>
                </List>
              </Box>
            )}
          </Box>

          {subcategoryID && (
            <Box sx={{ width: { xs: "100%", sm: 500 } }}>
              <Typography color="primary" variant="overline" component={"h6"}>
                Karten bearbeiten
              </Typography>
              <Box
                sx={{
                  padding: 2,
                  overflow: { lg: "auto" },
                  height: { lg: 500 },
                }}
              >
                {getCards().length > 0 ? (
                  getCards().map((card) => (
                    <Accordion key={card.id} onChange={() => setEditCardID("")}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{card.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {editCardID === card.id ? (
                          <FormControl fullWidth sx={{ gap: 2 }}>
                            <TextField
                              label="Neue Frage"
                              value={newCardQuestion}
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>
                              ) => setNewCardQuestion(event.target.value)}
                            />
                            <TextField
                              label="Neue Antwort"
                              multiline
                              rows={4}
                              value={newCardAnswer}
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>
                              ) => setNewCardAnswer(event.target.value)}
                            />
                          </FormControl>
                        ) : (
                          <>
                            <Typography>{card.answer}</Typography>
                            <Divider variant="fullWidth" sx={{ my: 2 }} />
                            <Stack direction={"column"}>
                              <Stack direction={"row"}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  fontWeight={"light"}
                                >
                                  Karte erstellt:
                                </Typography>
                                <Typography fontWeight={"light"}>
                                  {new Date(card.time).toLocaleString()} Uhr
                                </Typography>
                              </Stack>
                              <Stack direction={"row"}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  fontWeight={"light"}
                                >
                                  Abgefragt:
                                </Typography>
                                <Typography fontWeight={"light"}>
                                  {card.statistics.length}
                                </Typography>
                              </Stack>
                              <Stack direction={"row"}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  fontWeight={"light"}
                                >
                                  Richtig:
                                </Typography>
                                <Typography fontWeight={"light"}>
                                  {
                                    card.statistics.filter(
                                      (stat) => stat.correct
                                    ).length
                                  }
                                </Typography>
                              </Stack>
                              <Stack direction={"row"}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  fontWeight={"light"}
                                >
                                  Falsch:
                                </Typography>
                                <Typography fontWeight={"light"}>
                                  {
                                    card.statistics.filter(
                                      (stat) => !stat.correct
                                    ).length
                                  }
                                </Typography>
                              </Stack>
                            </Stack>
                          </>
                        )}
                      </AccordionDetails>
                      <AccordionActions>
                        {editCardID === card.id ? (
                          <>
                            <Button
                              onClick={() => {
                                changeCard(
                                  card.id,
                                  newCardQuestion,
                                  newCardAnswer
                                );
                                setEditCardID("");
                              }}
                            >
                              Speichern
                            </Button>
                            <Button onClick={() => setEditCardID("")}>
                              Abbrechen
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              color="primary"
                              onClick={() => {
                                setNewCardQuestion(card.question);
                                setNewCardAnswer(card.answer);
                                setEditCardID(card.id);
                              }}
                            >
                              Karte bearbeiten
                            </Button>
                            <Button
                              color="error"
                              onClick={() => deleteCard(card.id)}
                            >
                              Karte löschen
                            </Button>
                          </>
                        )}
                      </AccordionActions>
                    </Accordion>
                  ))
                ) : (
                  <Typography>Noch keine Karten angelegt.</Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};
