import { Button, Card, CardContent, CardHeader } from "@mui/material";
import { useContext } from "react";
import { DashboardContext } from "./Dashboard";

export const DashboardNoSubcategory = () => {
  const dashboardContext = useContext(DashboardContext);

  return (
    <>
      <Card sx={{ width: { xs: "100%", sm: 500 } }}>
        <CardHeader
          title={"Keine Unterkategorie gefunden"}
          subheader={"Bitte erstelle mindestens eine Unterkategorie."}
        />
        <CardContent>
          <Button
            variant="contained"
            onClick={() =>
              dashboardContext?.setDeschboardType("edit-subcategories")
            }
          >
            Unterkategorien anlegen
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
