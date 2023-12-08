import { Box } from "@mui/material";
import useLocalStorageState from "use-local-storage-state";

import { CartWidget } from "../Components/CartWidget";
import theme from "../Theme/Theme";
import { CaCartItem } from "../Types/interfaces";

export const BottomBar = () => {
  const [cart] = useLocalStorageState<CaCartItem>("cart", {
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
    },
  });

  const productsCount: number = Object.keys(cart ?? {}).length;
  return (
    <Box sx={{ backgroundColor: theme.palette.primary.light }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pr: 2,
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <CartWidget productsCount={productsCount} />
      </Box>
    </Box>
  );
};
