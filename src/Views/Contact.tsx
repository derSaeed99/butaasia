import { Grid, Typography } from "@mui/material";
import React from "react";

import { ContactForm } from "../Forms/ContactForm";
import theme from "../Theme/Theme";

export const Contact = () => {
  return (
    <>
      <Grid
        container
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ height: "85vh" }}
      >
        <Grid item display="flex" alignItems="center" flexDirection="column">
          <Typography
            gutterBottom
            sx={{
              color: theme.palette.primary.dark,
            }}
            variant="h6"
          >
            Sie haben Fragen?{" "}
          </Typography>
          <Typography
            gutterBottom
            sx={{
              color: theme.palette.primary.dark,
            }}
            variant="h6"
          >
            Schreiben Sie uns doch gerne!
          </Typography>
        </Grid>
        <Grid item>
          <ContactForm />
        </Grid>
      </Grid>
    </>
  );
};
