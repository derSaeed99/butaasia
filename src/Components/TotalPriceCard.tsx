import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

import { PayPal } from "./PayPal";

interface TotalCartItemsProps {
  total: number;
  subTotal: number;
  tax: number;
}

export const TotalPriceCard = ({
  subTotal,
  tax,
  total,
}: TotalCartItemsProps) => {
  return (
    <Card
      variant="outlined"
      sx={{ backgroundColor: "transparent", borderRadius: 5 }}
    >
      <CardContent>
        <Box>
          <Typography variant="h6">Bestellübersicht</Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Box>
        <Box display="flex">
          <Typography>SubTotal: </Typography>
          <Typography sx={{ ml: 1 }} fontWeight={"bold"}>
            {subTotal} €
          </Typography>
        </Box>
        <Box display="flex">
          <Typography>Tax: </Typography>
          <Typography sx={{ ml: 1 }} fontWeight={"bold"}>
            {tax} €
          </Typography>
        </Box>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Box display="flex">
          <Typography>Total: </Typography>
          <Typography sx={{ ml: 1 }} fontWeight={"bold"}>
            {total} €
          </Typography>
        </Box>
        <Box display="flex" sx={{ mt: 2 }}>
          <PayPal />
        </Box>
      </CardContent>
      <CardActions>
        <Button>Jetzt Bestellen</Button>
      </CardActions>
    </Card>
  );
};
