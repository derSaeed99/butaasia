import { Box, Typography } from "@mui/material";

import starBadge from "../assets/star-badge-blue.svg";
// https://www.svgrepo.com/svg/1195/premium-badge?edit=true
interface UserNumberBadgeProps {
  value: number;
}

export const UserNumberBadge = ({ value }: UserNumberBadgeProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={starBadge}
        alt="star badge"
        style={{ width: "20px", height: "20px" }}
      />
      <Typography variant="caption" sx={{ color: "GrayText" }}>
        N#{value}
      </Typography>
    </Box>
  );
};
