import { Input } from "@/components/ui/input";
import { useContext, useState, useMemo } from "react";
import Heading from "../components/Heading";
import { AppContext } from "@/Context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { MdSearch } from "react-icons/md";

const Orders = () => {
  const { orders } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(
      (order) =>
        order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [orders, searchTerm]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Orders"
        description="View and track customer orders."
      />
      <div className="relative max-w-sm">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-2 h-4 w-4" />
        <Input
          placeholder="Search orders by customer or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  {searchTerm ? (
                    <div className="space-y-2">
                      <p className="text-text-secondary text-sm">
                        No orders found matching "{searchTerm}"
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-text-secondary text-sm">No orders found</p>
                      <p className="text-xs text-text-muted-2">
                        No orders have been placed yet
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => (
                <TableRow key={index} className="hover:bg-secondary/60">
                  <TableCell className="text-center text-text-secondary text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm text-foreground">
                    {order.user.fullname}
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {order.products.map((p, idx) => (
                      <div key={idx}>
                        {p.name} ({p.quantity})
                        {idx !== order.products.length - 1 ? <br /> : null}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="font-medium text-sm text-foreground">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(order?.totalAmount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {searchTerm && filteredOrders.length > 0 && (
        <div className="text-sm text-text-muted-2">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
};

export default Orders;
