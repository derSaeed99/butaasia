import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import theme from "./Theme/Theme";

export const App = () => {
  return (
    <Box sx={{ backgroundColor: theme.palette.primary.light }}>
      <Outlet />
    </Box>
  );
};
