import { ShoppingCartOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Rating,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

import { subscribeToRating } from "../firebase";
import theme from "../Theme/Theme";
import { CaCartItem, CaProduct } from "../Types/interfaces";
import { Valuations } from "../Types/Types";

export const ProductDetails = ({ products }: { products: CaProduct[] }) => {
  const { productId } = useParams<{ productId: string }>();
  const [count, setCount] = useState<number>(1);
  const [rating, setRating] = useState<Valuations | null>(null);
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
  const product: CaProduct | undefined = products.find(
    (p) => productId && p.productId === productId
  );
  if (!product) {
    return <div>Product not found</div>;
  }
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

  const [selectedImage, setSelectedImage] = useState(0);
  const [details, setDetails] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  useEffect(() => {
    const getRating = async () => {
      const unsubscribeToRating = subscribeToRating({
        valuationId: productId ?? "",
        observer: (rating: Valuations | null) => setRating(rating),
        onError: (error) => {
          setRating(null);
          console.log(error);
        },
      });
      return () => unsubscribeToRating();
    };
    getRating();
  }, []);

  return (
    <Container maxWidth="md">
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {/* Left Box */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{ backgroundColor: theme.palette.primary.light }}
          >
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>
            <CardMedia
              component="img"
              height="140"
              image={product.imageUrl}
              alt={product.title}
              sx={{ borderRadius: 5 }}
            />
            <Box sx={{ display: "flex", marginTop: 2 }}>
              {product.additionalImages?.map((imgs, index) => (
                <CardMedia
                  component="img"
                  height="140"
                  image={imgs}
                  alt={product.title}
                  key={index}
                  sx={{
                    width: 50,
                    height: 50,
                    cursor: "pointer",
                    borderRadius: 2,
                    mr: 1,
                    opacity: index === selectedImage ? 0.5 : 1,
                  }}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
        {/* Right Box */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "baseline",
              backgroundColor: theme.palette.primary.light,
              mt: 1,
              ml: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                mb: 2,
                ml: { sm: 2, xs: 0 },
                mt: { xs: 2, sm: 2 },
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setDetails(0)}
                sx={{
                  marginBottom: 1,
                  textDecoration: "none",
                }}
              >
                Productbeschreibung
              </Button>
              <Button
                variant="outlined"
                onClick={() => setDetails(1)}
                sx={{
                  marginBottom: 1,
                  textDecoration: "none",
                }}
              >
                Weitere Informationen
              </Button>
              <Button
                onClick={() => setDetails(2)}
                variant="outlined"
                sx={{
                  textDecoration: "none",
                }}
              >
                Rezept
              </Button>
            </Box>
            <Box width="100%">
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  width: "100%",
                  m: { sm: 2 },
                  mb: { xs: 2 },
                  height: 170,
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                {details === 0 ? (
                  <Typography sx={{ m: 1 }}>Productbeschreibung</Typography>
                ) : details === 1 ? (
                  <Typography sx={{ m: 1 }}>Weitere Informationen</Typography>
                ) : details === 2 ? (
                  <Typography sx={{ m: 1 }}>Rezept</Typography>
                ) : (
                  ""
                )}
              </Paper>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              mt: 2,
            }}
          >
            <Rating value={rating?.total || null} readOnly precision={0.5} />
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
        </Grid>
      </Grid>
    </Container>
  );
};
