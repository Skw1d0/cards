import { Button, Card, CardContent, CardHeader } from "@mui/material";
import { useContext } from "react";
import { DashboardContext } from "./Dashboard";

export const DashboardNoCategory = () => {
  const dashboardContext = useContext(DashboardContext);

  return (
    <>
      <Card sx={{ width: { xs: "100%", sm: 500 } }}>
        <CardHeader
          title={"Keine Kategorie gefunden"}
          subheader={"Bitte erstelle mindestens eine Kategorie."}
        />
        <CardContent>
          <Button
            variant="contained"
            onClick={() =>
              dashboardContext?.setDeschboardType("edit-subcategories")
            }
          >
            Kategorien anlegen
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
