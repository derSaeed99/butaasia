import { ShoppingCartOutlined } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CartWidgetProps {
  productsCount: number;
}

export const CartWidget = ({ productsCount }: CartWidgetProps) => {
  const navigate = useNavigate();
  return (
    <IconButton onClick={() => navigate("/cart")} color="inherit">
      <Badge badgeContent={productsCount} color="error">
        <ShoppingCartOutlined />
      </Badge>
    </IconButton>
  );
};
