import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import React, { ChangeEvent, useContext, useState } from "react";
import { AppContext } from "../App";
import {
  Cancel,
  Delete,
  Edit,
  ExpandMore,
  Save,
  Share,
} from "@mui/icons-material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { styled } from "@mui/material/styles";

export const Categories = () => {
  const {
    categories,
    createCategory,
    deleteCategorey,
    changeCategoryName,
    exportCategory,
    importCategory,
    getCategoryByID,
  } = useCategoriesStore();
  const appContext = useContext(AppContext);
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [editCategoryID, setEditCategoryID] = useState("");
  const [editCategoryValue, setEditCategoryValue] = useState("");
  const [categoryIDToDelete, setCategoryIDToDelete] = useState("");
  const [categoryIDToExport, setCategoryIDToExport] = useState("");

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const toggleOpenDeleteDialog = (id?: string) => {
    if (id) setCategoryIDToDelete(id);
    setShowDeleteDialog(!showDeleteDialog);
  };

  const handleCopyText = () => {
    setShowSnackbar(true);
    setSnackbarMessage("Text in die Zwischenablage kopiert.");
  };

  const toggleOpenExportDialog = (id?: string) => {
    if (id) setCategoryIDToExport(id);
    setShowExportDialog(!showExportDialog);
  };

  const handleDeleteCategory = () => {
    deleteCategorey(categoryIDToDelete);
    toggleOpenDeleteDialog();
  };

  const handleCreateCategory = () => {
    if (categoryInputValue === "") return;
    createCategory(categoryInputValue);
    setCategoryInputValue("");
  };

  const handleEditCategory = (categoryID: string, categoryName: string) => {
    setEditCategoryID(categoryID);
    setEditCategoryValue(categoryName);
  };

  const handleSaveCategory = (id: string, name: string) => {
    changeCategoryName(id, name);
    setEditCategoryValue("");
    setEditCategoryID("");
  };

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

  const handleImportCategory = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      if (importCategory(content)) {
        setShowSnackbar(true);
        setSnackbarMessage("Kategorie erfolgreich importiert.");
      } else {
        setShowSnackbar(true);
        setSnackbarMessage("Beim Importieren ist ein Fehler aufgetreten.");
      }
    };
    reader.readAsText(file); // Lese die Datei als Text
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <>
      <Box sx={{ margin: 2, display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box sx={{ width: { xs: "100%", sm: 500 } }}>
          <Accordion>
            <AccordionSummary
              sx={{
                paddingLeft: 0,
              }}
              expandIcon={<ExpandMore />}
            >
              <CardHeader
                sx={{ color: "primary.main" }}
                title="Neue Kategorie anlegen"
                subheader="Lege eine neue Kategorie an."
              />
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <TextField
                    fullWidth
                    id="add-category"
                    label="Kategoriename"
                    variant="outlined"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setCategoryInputValue(event.target.value);
                    }}
                    value={categoryInputValue}
                    sx={{ flexGrow: 1 }}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    sx={{ width: 150 }}
                    type="submit"
                    variant="contained"
                    onClick={handleCreateCategory}
                    disabled={categoryInputValue === ""}
                  >
                    Anlegen
                  </Button>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              sx={{
                paddingLeft: 0,
              }}
              expandIcon={<ExpandMore />}
            >
              <CardHeader
                sx={{ color: "primary.main" }}
                title="Kategorie importieren"
                subheader="Importiere eine Kategorie mittels JSON-Datei."
              />
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                  >
                    Importieren
                    <VisuallyHiddenInput
                      type="file"
                      accept="application/json"
                      onChange={handleImportCategory}
                      multiple
                    />
                  </Button>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box sx={{ width: { xs: "100%", sm: 500 } }}>
          <Card>
            <CardHeader
              sx={{ color: "primary.main" }}
              title="Kategorie wählen"
              subheader="Wähle eine Kategorie, die du üben oder bearbeiten willst."
            />
            <CardContent>
              <List>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <ListItem divider key={category.id}>
                      {editCategoryID === category.id ? (
                        <>
                          <ListItemText>
                            <FormControl fullWidth>
                              <TextField
                                value={editCategoryValue}
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>
                                ) => setEditCategoryValue(event.target.value)}
                              />
                            </FormControl>
                          </ListItemText>
                          <Stack direction={"row"}>
                            <IconButton
                              onClick={() =>
                                handleSaveCategory(
                                  category.id,
                                  editCategoryValue
                                )
                              }
                            >
                              <Save />
                            </IconButton>
                            <IconButton onClick={() => setEditCategoryID("")}>
                              <Cancel />
                            </IconButton>
                          </Stack>
                        </>
                      ) : (
                        <ListItemButton
                          onClick={() => {
                            appContext?.setSelectedCategoryID(category.id);
                          }}
                        >
                          <ListItemText>{category.name}</ListItemText>
                        </ListItemButton>
                      )}

                      {editCategoryID !== category.id && (
                        <>
                          <IconButton
                            onClick={() => {
                              handleEditCategory(category.id, category.name);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            // onClick={() => toggleOpenExportDialog(category.id)}
                            onClick={() => handleExportCategory(category.id)}
                          >
                            <Share />
                          </IconButton>
                          <IconButton
                            onClick={() => toggleOpenDeleteDialog(category.id)}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </ListItem>
                  ))
                ) : (
                  <Typography>Keine Kategorie vorhanden</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Dialog open={showDeleteDialog} onClose={() => toggleOpenDeleteDialog()}>
        <DialogTitle>Wirklich löschen?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Willst du die Kategorie wirklick löschen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCategory}>Löschen</Button>
          <Button onClick={() => toggleOpenDeleteDialog()}>Abbrechen</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showExportDialog}
        onClose={() => toggleOpenExportDialog()}
        fullWidth
      >
        <DialogTitle>Kategorie exportieren</DialogTitle>
        <DialogContent>
          <Typography marginBottom={2}>
            Kopiere den Text im unteren Feld, indem du auf "Kopieren" klickst
            und teile ihn. Unter "Kategorie importieren" kann der kopierte Text
            eingefügt, und somit eine neue Kategorie erstellt werden.
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            disabled
            defaultValue={exportCategory(categoryIDToExport)}
          />
        </DialogContent>
        <DialogActions>
          <CopyToClipboard
            text={exportCategory(categoryIDToExport)}
            onCopy={handleCopyText}
          >
            <Button>Kopieren</Button>
          </CopyToClipboard>
          <Button onClick={() => toggleOpenExportDialog()}>Abbrechen</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
    </>
  );
};
