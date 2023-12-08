import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { ValuationCard } from "../Components/ValuationCard";
import { firebaseGetProductsValuations } from "../firebase";
import theme from "../Theme/Theme";
import { Valuations } from "../Types/Types";

export const Ratings = () => {
  const [valuations, setValuations] = useState<Valuations[]>();

  useEffect(() => {
    const getRatings = async () => {
      const ratingsDocs = await firebaseGetProductsValuations();
      const ratings = ratingsDocs.map((item) => item as Valuations);
      setValuations(ratings);
    };
    getRatings();
  }, []);
  return (
    <Grid
      container
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "auto",
        maxWidth: "100%",
      }}
    >
      <Grid item>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: theme.palette.primary.dark, mb: 2 }}
        >
          Bewertungen
        </Typography>
      </Grid>
      <Grid item display="flex" flexWrap="wrap" justifyContent="center" xs={12}>
        <ValuationCard valuations={valuations ? valuations : []} />
      </Grid>
    </Grid>
  );
};
