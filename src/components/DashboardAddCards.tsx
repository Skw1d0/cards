import {
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
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import { AppContext } from "../App";
import { ChangeEvent, useContext, useState } from "react";
import { DashboardNoSubcategory } from "./DashboardNoSubcategory";
import { v4 } from "uuid";

export const DashboardAddCards = () => {
  const { getCategoryByID, addCard } = useCategoriesStore();
  const appContext = useContext(AppContext);

  const [subcategoryID, setSubcategoryID] = useState("");
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

  return (
    <>
      {getSubcategoryLength() === 0 ? (
        <DashboardNoSubcategory />
      ) : (
        <>
          <Card sx={{ width: { xs: "100%", sm: 500 }, marginBottom: 2 }}>
            <CardHeader
              sx={{ color: "primary.main" }}
              title="Karteikarte anlegen"
            />
            <CardContent>
              <List>
                <ListItem>
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
                          <MenuItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </ListItem>
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
              </CardActions>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};
