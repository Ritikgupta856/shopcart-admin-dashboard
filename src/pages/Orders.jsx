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
import { Badge } from "@/components/ui/badge";
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
    <div className="w-full min-h-screen p-0 sm:p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Heading
            title={`Orders (${orders.length})`}
            description="Manage your orders"
          />
        </div>
      </div>
      <div className="relative mb-6">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search orders by customer or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="cursor-pointer">
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {searchTerm ? (
                    <div className="space-y-2">
                      <p className="text-gray-500">
                        No orders found matching "{searchTerm}"
                      </p>
                      <Button
                        onClick={() => setSearchTerm("")}
                        className="text-sm"
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-500">No orders found</p>
                      <p className="text-sm text-gray-400">
                        No orders have been placed yet
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.user.fullname}
                  </TableCell>
                  <TableCell className="font-medium ">
                    {order.products.map((p, idx) => (
                      <div key={idx}>
                        {p.name} ({p.quantity})
                        {idx !== order.products.length - 1 ? <br /> : null}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="font-medium">
                    {(() => {
                      switch (order.status) {
                        case "paid":
                          return (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Paid
                            </Badge>
                          );
                        case "pending":
                          return (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          );
                        case "failed":
                          return (
                            <Badge className="bg-red-100 text-red-700 border-red-200">
                              Failed
                            </Badge>
                          );
                        case "cancelled":
                          return (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              Cancelled
                            </Badge>
                          );
                        default:
                          return (
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                              Unknown
                            </Badge>
                          );
                      }
                    })()}
                  </TableCell>
                  <TableCell className="font-medium">
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
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
};

export default Orders;
