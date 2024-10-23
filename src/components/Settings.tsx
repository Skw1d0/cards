import {
  CloudDownload,
  CloudUpload,
  Delete,
  Google,
} from "@mui/icons-material";
import {
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
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { useFirestore } from "../hooks/useFirestore";
import { AppContext } from "../App";

export const Settings = () => {
  const { upload, download } = useFirestore();
  const appContext = useContext(AppContext);

  const { reset, setCategories, syncTime, setSyncTime } = useCategoriesStore();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openLoadDialog, setOpenLoadDialog] = useState(false);
  const [openSaveDialog, setSaveSaveDialog] = useState(false);
  const [openDeleteData, setOpenDeleteData] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { user, googleSignIn, googleSignOut } = useAuth();

  const handleResetLocalStore = async () => {
    try {
      appContext?.setSelectedCategoryID(undefined);
      reset();
      if (user) {
        const data = await download();
        if (data) {
          setSyncTime(data.syncTime);
        }
      }
      setOpenDeleteData(false);
      setOpenSnackbar(true);
      setSnackbarMessage("Lokale Daten gelöscht.");
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleUpload = async () => {
    const success = await upload();
    setSaveSaveDialog(false);

    if (success) {
      setSnackbarMessage("Erfolgreiche gespeichern.");
      setOpenSnackbar(true);
      setSyncTime(Date.now());
    } else {
      setSnackbarMessage("Beim Speichern ist ein Fehler aufgetreten.");
      setOpenSnackbar(true);
    }
  };

  const handleDownload = async () => {
    const data = await download();
    setOpenLoadDialog(false);

    if (data) {
      setCategories(data.categories);
      setSyncTime(data.syncTime);
      appContext?.setSelectedCategoryID(undefined);
      setSnackbarMessage("Erfolgreiche geladen.");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Beim Laden der Daten ist ein Fehler aufgetreten.");
      setOpenSnackbar(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      const success = await download();
      setSyncTime(success?.syncTime);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    const syncTime = async () => {
      const data = await download();
      setSyncTime(data?.syncTime);
    };

    syncTime();
  }, []);

  return (
    <Box sx={{ margin: 2, display: "flex", flexWrap: "wrap", gap: 3 }}>
      <Box sx={{ width: { xs: "100%", sm: 500 } }}>
        <Card>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Firebase"
            subheader=" Mit der Firebase Datenbank hast du die Möglichkeit, deine lokalen
              Daten online zu speichern und diese auf einem anderen Gerät wieder
              abzurufen (syncronisieren)."
          />
          <CardContent>
            <Box>
              {user?.uid === undefined ? (
                <Button
                  startIcon={<Google />}
                  color="primary"
                  variant="contained"
                  onClick={() => handleGoogleSignIn()}
                >
                  Anmelden mit Google
                </Button>
              ) : (
                <Box>
                  <Typography
                    textTransform={"uppercase"}
                    color="primary"
                    fontSize={"0.8em"}
                  >
                    Angemeldeter Benutzer:
                  </Typography>
                  <Typography marginBottom={2}>{user.email}</Typography>
                  <Stack direction={"column"} marginBottom={2}>
                    <Typography
                      textTransform={"uppercase"}
                      color="primary"
                      fontSize={"0.8em"}
                    >
                      Letzter Speicherstand:
                    </Typography>
                    <Typography>
                      {syncTime === undefined
                        ? "kein"
                        : new Date(syncTime).toLocaleString() + " Uhr"}
                    </Typography>
                  </Stack>
                  <Box display={"flex"} flexWrap={"wrap"} gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<CloudUpload />}
                      onClick={() => setSaveSaveDialog(true)}
                    >
                      Speichern
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CloudDownload />}
                      onClick={() => setOpenLoadDialog(true)}
                    >
                      Laden
                    </Button>
                    <Button
                      onClick={googleSignOut}
                      variant="outlined"
                      color="error"
                      startIcon={<Google />}
                    >
                      Abmelden
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ width: { xs: "100%", sm: 500 } }}>
        <Card>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Lokale Daten löschen"
            subheader="Das Löschen der lokalen Daten wird
              sofort und unwiederbringlich durchgeführt!"
          />
          <CardContent>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setOpenDeleteData(true)}
              startIcon={<Delete />}
            >
              Lokalen Daten löschen
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={2000}
        message={snackbarMessage}
      />

      <Dialog open={openSaveDialog} onClose={() => setOpenLoadDialog(false)}>
        <DialogTitle>Daten auf Firebase speichern?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-load-data">
            Willst du wirklich die lokalen Daten auf Firebase speichern?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleUpload()}>Speichern</Button>
          <Button autoFocus onClick={() => setSaveSaveDialog(false)}>
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openLoadDialog} onClose={() => setOpenLoadDialog(false)}>
        <DialogTitle>Daten von Firebase laden?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-load-data">
            Willst du wirklich die lokalen Daten aus Firebase überschreiben?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDownload()}>Laden</Button>
          <Button autoFocus onClick={() => setOpenLoadDialog(false)}>
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteData} onClose={() => setOpenLoadDialog(false)}>
        <DialogTitle>Daten löschen?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-load-data">
            Willst du wirklich alle lokalen Daten löschen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleResetLocalStore()}>Löschen</Button>
          <Button autoFocus onClick={() => setOpenDeleteData(false)}>
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
