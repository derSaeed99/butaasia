import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

import { TotalPriceCard } from "../Components/TotalPriceCard";
import theme from "../Theme/Theme";
import { CaCartItem } from "../Types/interfaces";

type CartState = {
  [productId: string]: CaCartItem;
};

export const Cart = () => {
  const [, setCount] = useState<number>(1);
  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [cart, setCart] = useLocalStorageState<CartState>("cart", {
    defaultValue: {
      ["productId"]: {
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
    },
  });
  const location = useLocation();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location, cart]);

  const handleChange = (value: number, product: CaCartItem) => {
    setCount(value);
    const productId = product.productId ?? "";
    setCart((prevCart: CartState) => ({
      ...prevCart,
      [productId]: {
        ...product,
        quantity: value,
        tax: 0.19,
        price: product.price,
        totalPrice: product.price * value * 1.19,
        createdAt: new Date(),
      },
    }));
  };
  const handleRemoveProduct = (productId: string): void => {
    setCart((prevCart: CartState) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  const isInCart = (productId: string): boolean =>
    Object.keys(cart ?? {}).includes(String(productId));

  const getProducts = () => Object.values(cart ?? {});
  const subTotal = getProducts().reduce(
    (accumulator: number, product) =>
      accumulator + product.price * product.quantity,
    0
  );
  const grandTotal = getProducts().reduce(
    (accumulator: number, product) => accumulator + Number(product.totalPrice),
    0
  );
  const totalTax = grandTotal - subTotal;
  const clearCart = () => {
    setCart({});
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: xs ? "column" : "row",
      }}
    >
      <Box width={xs ? "100%" : "60%"}>
        <Button onClick={clearCart}>Clear Cart</Button>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ backgroundColor: theme.palette.primary.light }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Item</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Anzahl</TableCell>
                <TableCell align="right">Tax</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getProducts().map((product: CaCartItem) => (
                <TableRow key={product.productId}>
                  <TableCell align="left" component="th" scope="row">
                    <Avatar
                      src={product.imageUrl}
                      sx={{ width: 50, height: 50, mb: 1 }}
                    />
                    {product.title}
                    <Typography sx={{ ml: 1 }} variant="caption">
                      {product.quantity}x
                    </Typography>
                  </TableCell>
                  <TableCell align="right" component="th" scope="row">
                    {(product?.price ?? 0).toFixed(2)} €
                  </TableCell>
                  <TableCell align="right" component="th" scope="row">
                    <Box sx={{ display: "flex", mr: -1 }}>
                      <Select
                        value={product.quantity}
                        sx={{ borderRadius: 50 }}
                        fullWidth
                        label={product.quantity}
                        onChange={(e) =>
                          handleChange(e.target.value as number, product)
                        }
                      >
                        {options.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {isInCart(product.productId) && (
                        <IconButton
                          onClick={() => handleRemoveProduct(product.productId)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right" component="th" scope="row">
                    19 %
                  </TableCell>
                  <TableCell align="right">
                    {product.totalPrice?.toFixed(2)} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ ml: 8, mt: { xs: 2, sm: 0 } }}>
        <TotalPriceCard
          subTotal={Number(toFixedWithoutRounding(subTotal, 2) ?? 0)}
          tax={Number(toFixedWithoutRounding(totalTax, 2) ?? 0)}
          total={Number(toFixedWithoutRounding(grandTotal, 2) ?? 0)}
        />
      </Box>
    </Box>
  );
};

function toFixedWithoutRounding(value: number, precision: number): string {
  const multiplier = Math.pow(10, precision || 0);
  return (Math.floor(value * multiplier) / multiplier).toFixed(precision);
}
