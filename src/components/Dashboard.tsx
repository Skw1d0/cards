import { Box } from "@mui/material";
import { DashboradNavigation } from "./DashboradNavigation";
import { DashboardManageSubcategories } from "./DashboardManageSubcategories";
import { createContext, useState } from "react";
import { DashboardManageCards } from "./DashboardManageCards";
import { DashboardAddCards } from "./DashboardAddCards";
import { Query } from "./Query";

type DashboradTypes =
  | undefined
  | "query"
  | "edit-subcategories"
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
  const [dashboardType, setDeschboardType] =
    useState<DashboradTypes>(undefined);

  return (
    <DashboardContext.Provider value={{ dashboardType, setDeschboardType }}>
      <Box sx={{ margin: 2 }}>
        <DashboradNavigation />
        {dashboardType === "query" && <Query />}
        {dashboardType === "add-cards" && <DashboardAddCards />}
        {dashboardType === "edit-cards" && <DashboardManageCards />}
        {dashboardType === "edit-subcategories" && (
          <DashboardManageSubcategories />
        )}
      </Box>
    </DashboardContext.Provider>
  );
};
