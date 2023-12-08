import {
  AppBar as TopBar,
  Button,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Logo from "../buta_logo.png";
import theme from "../Theme/Theme";
export const AppBar = () => {
  const navigate = useNavigate();

  return (
    <>
      <TopBar
        elevation={0}
        sx={{ backgroundColor: theme.palette.primary.light }}
        position="sticky"
      >
        <Grid
          container
          height="100px"
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          flexDirection="row"
        >
          <Grid item sm={4}>
            <img
              onClick={() => navigate("/")}
              style={{ width: 100 }}
              alt="buta-logo"
              src={Logo}
            />
          </Grid>
          <Grid
            item
            sm={8}
            rowSpacing={2}
            sx={{ mb: 2, pr: 5 }}
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
          >
            <Link>
              <Button onClick={() => navigate("/")} variant="text">
                <Typography sx={{ color: theme.palette.primary.dark }}>
                  Buta
                </Typography>
              </Button>
            </Link>
            <Link>
              <Button onClick={() => navigate("/products")}>
                <Typography sx={{ color: theme.palette.primary.dark }}>
                  Products
                </Typography>
              </Button>
            </Link>
            <Link>
              <Button onClick={() => navigate("/about")} variant="text">
                <Typography sx={{ color: theme.palette.primary.dark }}>
                  Buta Blog
                </Typography>
              </Button>
            </Link>
          </Grid>
        </Grid>
      </TopBar>
    </>
  );
};
