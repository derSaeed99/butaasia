import { Box } from "@mui/material"

import theme from "../Theme/Theme"
import { HeroView } from "../Views/HeroView"


export const Home = () => {
  return (
    <Box sx={{backgroundColor: theme.palette.primary.light}}>
    <HeroView/>
    </Box>
  )
}
