import { Box, Typography } from "@mui/material";

import starBadge from "../assets/star-badge-green.svg";
// https://www.svgrepo.com/svg/1195/premium-badge?edit=true
interface UserMFABadgeProps {
    value: boolean;
  }
  
  export const UserMFABadge = ({ value } :UserMFABadgeProps) => {
    
  return (
    <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: value ? 1 : 0.5
    }}>
    <img src={starBadge} alt="star badge" style={{ width: "20px", height: "20px" }} />
    <Typography variant="caption" sx={{ color: "GrayText" }}>
      MF
      </Typography>
    </Box>
  );
  };