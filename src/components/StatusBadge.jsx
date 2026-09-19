import { Badge } from "@/components/ui/badge";

const orderStatusVariant = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  cancelled: "secondary",
};

export const OrderStatusBadge = ({ status }) => (
  <Badge variant={orderStatusVariant[status] || "secondary"} className="capitalize">
    {status}
  </Badge>
);

export const StockBadge = ({ stock }) => {
  if (stock === 0) {
    return <Badge variant="danger">Out of stock</Badge>;
  }
  if (stock <= 5) {
    return <Badge variant="warning">Low stock ({stock})</Badge>;
  }
  return <Badge variant="success">In stock ({stock})</Badge>;
};
