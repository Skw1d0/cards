import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { useCategoriesStore } from "../stores/storeCategories";
import { useContext } from "react";
import { AppContext } from "../App";

interface PieChartType {
  id: number;
  value: number;
  label: string;
}

export const Charts = () => {
  const { categories } = useCategoriesStore();
  const appContext = useContext(AppContext);

  const getCategoryData = (): PieChartType[] => {
    if (appContext?.selectedCategoryID === undefined) return [];

    const data = categories
      .find((category) => category.id === appContext?.selectedCategoryID)
      ?.subcategories.map((subcategory, index) => {
        return {
          id: index,
          value: subcategory.cards.length,
          label: subcategory.name,
        };
      });

    if (data === undefined) return [];
    return data;
  };

  const getXLabel = () => {
    return categories
      .find((Category) => Category.id === appContext?.selectedCategoryID)
      ?.subcategories.map((subcategory) => subcategory.name);
  };

  const getCardCorrectness = (value: boolean) => {
    return categories
      .find((Category) => Category.id === appContext?.selectedCategoryID)
      ?.subcategories.map((subcategory) => subcategory.cards)
      .map((card) =>
        card
          .map((statistics) => statistics.statistics)
          .flat()
          .filter((statistic) => statistic.correct === value)
      )
      .map((c) => c.length);
  };

  return (
    <Box sx={{ margin: 2, display: "flex", flexWrap: "wrap", gap: 3 }}>
      <Box sx={{ width: { xs: "100%", sm: 500 } }}>
        <Card>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Unterkategorien & Karten"
            subheader="Hier siehst du deine Unterkategoriern und wie viele Karten sie beinhalten."
          />
          <CardContent>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <PieChart
                series={[
                  {
                    data: getCategoryData(),
                    outerRadius: 80,
                    innerRadius: 40,
                    cx: 200,
                    cy: 150,
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "top", horizontal: "middle" },
                    padding: 0,
                  },
                }}
                width={400}
                height={250}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ width: { xs: "100%", sm: 500 } }}>
        <Card>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Beantwortete Fragen"
            subheader="Hier siehst du, wie viele Karten du je Unterkategorie richitg oder falsch beantwortet hast."
          />
          <CardContent>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <BarChart
                width={500}
                height={300}
                series={[
                  {
                    data: getCardCorrectness(true),
                    label: "Richtig",
                    id: "correctId",
                    stack: "total",
                  },
                  {
                    data: getCardCorrectness(false),
                    label: "Falsch",
                    id: "notCorrectID",
                    stack: "total",
                  },
                ]}
                xAxis={[{ data: getXLabel(), scaleType: "band" }]}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
