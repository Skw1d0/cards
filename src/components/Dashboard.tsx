import { Box } from "@mui/material";
import { DashboradNavigation } from "./DashboradNavigation";
import { ManageSubcategories } from "./ManageSubcategories";
import { createContext, useContext, useState } from "react";
import { ManageCards } from "./ManageCards";
import { DashboardAddCards } from "./DashboardAddCards";
import { TrainCards } from "./TrainCards";
import { Charts } from "./Charts";
import { useCategoriesStore } from "../stores/storeCategories";
import { AppContext } from "../App";
import { DashboardNoSubcategory } from "./DashboardNoSubcategory";
import { ViewCards } from "./ViewCards";

type DashboradTypes =
  | undefined
  | "edit-subcategories"
  | "train-cards"
  | "view-cards"
  | "edit-cards"
  | "add-cards";

interface DashboardContextProps {
  dashboardType: DashboradTypes;
  setDeschboardType: (value: DashboradTypes) => void;
}

export const DashboardContext = createContext<
  DashboardContextProps | undefined
>(undefined);

export const Dashboard = () => {
  const appContext = useContext(AppContext);
  const { getCategoryByID } = useCategoriesStore();

  const [dashboardType, setDeschboardType] =
    useState<DashboradTypes>(undefined);

  const getSubcategoryLength = () => {
    if (appContext?.selectedCategoryID === undefined) return 0;
    return getCategoryByID(appContext?.selectedCategoryID)?.subcategories
      .length;
  };

  return (
    <DashboardContext.Provider value={{ dashboardType, setDeschboardType }}>
      <Box sx={{ margin: 2 }}>
        <DashboradNavigation />
        {dashboardType === "view-cards" && <ViewCards />}
        {dashboardType === "train-cards" && <TrainCards />}
        {dashboardType === "add-cards" && <DashboardAddCards />}
        {dashboardType === "edit-cards" && <ManageCards />}
        {dashboardType === "edit-subcategories" && <ManageSubcategories />}
        {dashboardType === undefined ? (
          getSubcategoryLength() === 0 ? (
            <DashboardNoSubcategory />
          ) : (
            <Charts />
          )
        ) : null}
      </Box>
    </DashboardContext.Provider>
  );
};
