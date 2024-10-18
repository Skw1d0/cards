import { Box } from "@mui/material";
import { DashboradNavigation } from "./DashboradNavigation";
import { ManageSubcategories } from "./ManageSubcategories";
import { createContext, useState } from "react";
import { ManageCards } from "./ManageCards";
import { DashboardAddCards } from "./DashboardAddCards";
import { Test } from "./Test";

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
        {dashboardType === "query" && <Test />}
        {dashboardType === "add-cards" && <DashboardAddCards />}
        {dashboardType === "edit-cards" && <ManageCards />}
        {dashboardType === "edit-subcategories" && <ManageSubcategories />}
      </Box>
    </DashboardContext.Provider>
  );
};