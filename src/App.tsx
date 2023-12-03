import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export const App = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};
