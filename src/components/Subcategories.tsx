import {
  ArrowForwardIos,
  Delete,
  Edit,
  Home,
  PsychologyAlt,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

import { useCategoriesStore } from "../stores/storeCategories";
import { useNavigate, useParams } from "react-router-dom";
import { getSubcategoryStatistics } from "../tools/getSubcategoryStatistics";
import { LineChart } from "@mui/x-charts";

export const Subcategories = () => {
  const navigate = useNavigate();

  const { getCategoryByID, deleteSubcategory, getCards } = useCategoriesStore();
  const { categoryID } = useParams();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="content-container">
      <div className="card" style={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <IconButton color="primary" onClick={() => navigate("/")}>
            <Home />
          </IconButton>
          <Typography>
            {categoryID && getCategoryByID(categoryID)?.name}
          </Typography>
        </Breadcrumbs>
      </div>
      {categoryID &&
        getCategoryByID(categoryID)?.subcategories.map((subcategory) => (
          <Card className="card" key={subcategory.id}>
            <CardHeader
              sx={{ display: "flex" }}
              title={subcategory.name}
              subheader={subcategory.cards.length + " Karteikarten"}
            />
            <CardContent>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={{ xs: "flex-start", md: "center" }}
                sx={{
                  marginTop: { xs: -12, sm: -10, md: -8 },
                  marginBottom: { xs: -8, sm: -6, md: -2 },
                  mx: { xs: -3, sm: -4 },
                }}
              >
                <LineChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: getSubcategoryStatistics(
                        getCards(categoryID, false, false, subcategory.id)
                      ).labels,
                    },
                  ]}
                  series={[
                    {
                      data: getSubcategoryStatistics(
                        getCards(categoryID, false, false, subcategory.id)
                      ).amount,
                    },
                  ]}
                  width={800}
                  height={300}
                  sx={{ "&&": { touchAction: "auto" } }}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<PsychologyAlt />}
                variant="contained"
                disabled={subcategory.cards.length === 0}
                onClick={() =>
                  navigate(`/training/${categoryID}/${subcategory.id}`)
                }
              >
                Lernen
              </Button>
              <Button
                // startIcon={<RemoveRedEye />}
                endIcon={<ArrowForwardIos />}
                variant="contained"
                onClick={() =>
                  navigate(`/cards/${categoryID}/${subcategory.id}`)
                }
              >
                Los geht's
              </Button>
              <Typography sx={{ flexGrow: 1 }} />
              <IconButton
                onClick={() =>
                  navigate(
                    `/manage-subcategory/${categoryID}/${subcategory.id}`
                  )
                }
              >
                <Edit />
              </IconButton>
              <IconButton onClick={() => deleteSubcategory(subcategory.id)}>
                <Delete />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      <Box>
        <Button onClick={() => navigate(`/manage-subcategory/${categoryID}`)}>
          Neue Unterkategorie erstellen
        </Button>
      </Box>
    </div>
  );
};
