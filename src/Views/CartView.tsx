import { Box, Typography } from "@mui/material";
import React from "react";
import useLocalStorageState from "use-local-storage-state";

import { Cart } from "../Store/Cart";
import { CaCartItem } from "../Types/interfaces";

export const CartView = () => {
  const [cart, ] = useLocalStorageState<CaCartItem>("cart", {
    defaultValue: {
      productId: "",
      title: "",
      price: 0,
      imageUrl: "",
      description: "",
      category: "",
      createdAt: new Date(),
      quantity: 0,
      totalPrice: 0,
      tax: 0,
      delivery: "",
    }
  });
  const emptyCart = Object.entries(cart ?? {}).length === 0;
  return emptyCart ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 10,
      }}
    >
      <Typography>Der Warenkorb ist noch leer</Typography>
    </Box>
  ) : (
    <Cart />
  );
};
