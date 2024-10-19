import { Button, Card, CardContent, Typography } from "@mui/material";
import { useContext } from "react";
import { DashboardContext } from "./Dashboard";

export const DashboardNoSubcategory = () => {
  const dashboardContext = useContext(DashboardContext);

  return (
    <>
      <Card sx={{ width: { xs: "100%", sm: 500 } }}>
        <CardContent>
          <Typography
            color="primary"
            variant="overline"
            component={"h6"}
            marginBottom={2}
          >
            Keine Unterkategorie angelegt
          </Typography>
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
