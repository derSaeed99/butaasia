import "./index.css";

import { Box, CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./App.routes";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Box sx={{ backgroundColor: "#212121" }}>
      <CssBaseline />
      <RouterProvider router={router} />
    </Box>
  </React.StrictMode>
);
