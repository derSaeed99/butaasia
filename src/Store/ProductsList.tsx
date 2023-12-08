import { ShoppingCartOutlined } from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import useLocalStorageState from "use-local-storage-state";

import theme from "../Theme/Theme";
import { CaCartItem } from "../Types/interfaces";

export const products = [
  {
    productId: "1",
    title: "Product 1",
    description:
      "This is the first product. And it has good things. Please buy it. I need money. Thanks. Bye. See you. :)",
    price: 10,
    additionalImages: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
    ],
    imageUrl: "https://picsum.photos/200/300",
    category: "Category 1",
    createdAt: new Date(),
  },
  {
    productId: "2",
    title: "Product 2",
    description: "This is the second product",
    price: 10,
    imageUrl: "https://picsum.photos/200/300",
    category: "Category 1",
    createdAt: new Date(),
  },
  {
    productId: "3",
    title: "Product 3",
    description: "This is the third product",
    price: 10,
    imageUrl: "https://picsum.photos/200/300",
    category: "Category 1",
    createdAt: new Date(),
  },
  {
    productId: "4",
    title: "Product 4",
    description: "This is the fourth product",
    price: 10,
    imageUrl: "https://picsum.photos/200/300",
    category: "Category 1",
    createdAt: new Date(),
  },
];

export const ProductsList = () => {
  const [count, setCount] = useState<number>(1);
  const [cart, setCart] = useLocalStorageState<CaCartItem>("cart", {
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
  const navigate = useNavigate();

  const addToCart = (product: CaCartItem): void => {
    const productId = product.productId;
    setCart((prevCart: CaCartItem) => ({
      ...prevCart,
      [productId]: {
        ...product,
        quantity: count,
        tax: 0.19,
        price: product.price,
        totalPrice: product.price * Number(product.quantity) * 1.19,
        createdAt: new Date(),
        id: productId ?? "",
      },
    }));
  };

  const handleChange = (value: number) => {
    setCount(value);
  };

  const isInCart = (productId: string): boolean =>
    Object.keys(cart ?? {}).includes(productId.toString());

  return (
    <Container
      maxWidth="md"
      sx={{ backgroundColor: theme.palette.primary.light }}
    >
      <Box sx={{ ml: 3, pt: 2 }}>
        <Typography variant="h4">Alle Produkte</Typography>
      </Box>
      <Divider />
      {products.map((product) => (
        <Paper
          key={product.productId}
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            minHeight: 300,
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <Box>
            <CardMedia
              onClick={() => navigate(`${product.productId}`)}
              component="img"
              src={product.imageUrl}
              alt={product.title}
              sx={{ width: 200, height: 150, borderRadius: 5 }}
            />
          </Box>
          {/* Right side - Product Details */}
          <Box
            sx={{
              ml: { md: 10, xs: 2 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ maxWidth: 300, mr: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 4 }}
                onClick={() => navigate(`${product.productId}`)}
              >
                {product.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                {product.description}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Select
                disabled={isInCart(product.productId)}
                sx={{ borderRadius: 50, mr: 2 }}
                label="Count"
                onChange={(e) => handleChange(e.target.value as number)}
              >
                {[...Array(10)].map((_, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {index + 1}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="h6" sx={{ textAlign: "left", mr: 3 }}>
                {product.price.toFixed(2)}€
              </Typography>
              <IconButton
                sx={{
                  color: theme.palette.primary.main,
                  borderRadius: 50,
                  mr: 3,
                }}
                disabled={isInCart(product.productId)}
                onClick={() => {
                  const cartItem: CaCartItem = {
                    ...product,
                    tax: 0.19 * Number(count), // 19% tax
                    quantity: count,
                  };
                  addToCart(cartItem);
                }}
              >
                <ShoppingCartOutlined />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};
