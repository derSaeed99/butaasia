import { Grid } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";

import { Blog } from "../Components/Blog";
import { Reciepe } from "../Components/Reciepe";

export const AboutUs = () => {
  const [value, setValue] = useState("reciepe");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Grid container display="flex" sx={{ height: "85vh" }}>
      <Grid item xs={12}>
        <Tabs
          sx={{
            mt: 10,
            ml: 2,
            [`& .MuiButtonBase-root.MuiTab-root`]: {
              color: "#2B8622",
            },
            [`& .MuiTabs-indicator`]: {
              backgroundColor: "#2B8622",
            },
          }}
          value={value}
          onChange={handleChange}
        >
          <Tab value="reciepe" label={"Rezepte"} />
          <Tab value="posts" label="Posts" />
        </Tabs>
        {value === "reciepe" && <Reciepe />}
        {value === "posts" && <Blog />}
      </Grid>
    </Grid>
  );
};
