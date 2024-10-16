import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { DashboardContext } from "./Dashboard";
import { v4 } from "uuid";

export const DashboardManageCards = () => {
  const { getCategoryByID, deleteCard, changeCard, addCard } =
    useCategoriesStore();
  const appContext = useContext(AppContext);
  const dashboarContext = useContext(DashboardContext);

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
        <Box>
          <Card sx={{ width: { xs: "100%", sm: 500 }, marginBottom: 2 }}>
            <CardHeader
              sx={{ color: "primary.main" }}
              title="Karteikarten verwalten"
              subheader="Hierhast du die Möglichkeit, Karteikarten zu bearbeiten oder zu löschen. Wähle deine Unterkategorie."
            />
            <CardContent>
              <FormControl fullWidth>
                <InputLabel id="select-subcategories-label">
                  Unterkategorie
                </InputLabel>
                <Select
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
            </CardContent>
          </Card>

          {subcategoryID && (
            <>
              <Card sx={{ width: { xs: "100%", sm: 500 }, marginBottom: 2 }}>
                <CardHeader
                  sx={{ color: "primary.main" }}
                  title="Karteikarte anlegen"
                />
                <CardContent>
                  <List>
                    {/* <ListItem>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Unterkategorie
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={subcategoryID}
                          label="Unterkategorie"
                          onChange={handleChange}
                        >
                          {appContext?.selectedCategoryID &&
                            getCategoryByID(
                              appContext.selectedCategoryID
                            )?.subcategories.map((subcategory) => (
                              <MenuItem
                                key={subcategory.id}
                                value={subcategory.id}
                              >
                                {subcategory.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </ListItem> */}
                    <ListItem>
                      <FormControl fullWidth>
                        <TextField
                          sx={{ width: "100%" }}
                          label="Frage"
                          variant="outlined"
                          value={cardQuestion}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setCardQuestion(event.target.value)
                          }
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl fullWidth>
                        <TextField
                          multiline
                          rows={4}
                          sx={{ width: "100%" }}
                          label="Antwort"
                          variant="outlined"
                          value={cardAnswer}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setCardAnswer(event.target.value)
                          }
                        />
                      </FormControl>
                    </ListItem>
                  </List>
                  <CardActions>
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
                  </CardActions>
                </CardContent>
              </Card>

              <Card sx={{ width: { xs: "100%", sm: 500 }, marginBottom: 2 }}>
                <CardHeader
                  sx={{ color: "primary.main" }}
                  title="Karteikarten verwalten"
                />
                <CardContent>
                  {getCards().length > 0 ? (
                    getCards().map((card) => (
                      <Accordion
                        key={card.id}
                        onChange={() => setEditCardID("")}
                      >
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
                            <Typography>{card.answer}</Typography>
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
                    // <Button
                    //   variant="contained"
                    //   color="primary"
                    //   onClick={() =>
                    //     dashboarContext?.setDeschboardType("add-cards")
                    //   }
                    // >
                    //   Karteikarten anlegen
                    // </Button>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </Box>
      )}
    </>
  );
};
