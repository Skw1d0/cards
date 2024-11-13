import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="content-container">
      <Typography variant="h4" marginBottom={2}>
        404
      </Typography>
      <Typography>Seite nicht gefunden</Typography>
      <Button onClick={() => navigate("/")}>Home</Button>
    </div>
  );
};
