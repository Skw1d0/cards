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
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useCategoriesStore } from "../stores/storeCategories";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import { useFirestore } from "../hooks/useFirestore";

export const Settings = () => {
  const { upload, download } = useFirestore();

  const { reset, setCategories, syncTime, setSyncTime } = useCategoriesStore();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { user, googleSignIn, googleSignOut } = useAuth();

  const handleResetLocalStore = () => {
    setOpenSnackbar(true);
    setSnackbarMessage("Lokale Daten gelöscht.");
    reset();
  };

  const handleUpload = async () => {
    const success = await upload();
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
    const success = await download();
    if (success) {
      setCategories(success.categories);
      setSyncTime(success.syncTime);
      setSnackbarMessage("Erfolgreiche geladen.");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Beim Laden der Daten ist ein Fehler aufgetreten.");
      setOpenSnackbar(true);
    }
  };

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
                  onClick={googleSignIn}
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
                      onClick={() => handleUpload()}
                    >
                      Speichern
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CloudDownload />}
                      onClick={() => handleDownload()}
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
              onClick={() => handleResetLocalStore()}
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
    </Box>
  );
};
