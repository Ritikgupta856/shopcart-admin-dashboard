import { useContext, useMemo } from "react";
import Heading from "../components/Heading";
import StatCard from "@/components/StatCard";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppContext } from "@/Context/AppContext";
import {
  FaRupeeSign,
  FaShoppingCart,
  FaFolderOpen,
  FaClipboardList,
  FaUserFriends,
  FaTrophy,
  FaBoxOpen,
} from "react-icons/fa";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const Dashboard = () => {
  const { products, orders, users, totalRevenue } = useContext(AppContext);

  const stats = [
    {
      title: "Total Revenue",
      value: totalRevenue?.toLocaleString() || '0',
      prefix: "₹",
      icon: FaRupeeSign,
      description: "Total earnings from all orders"
    },
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: FaShoppingCart,
      description: "Products available in store"
    },
    {
      title: "Total Orders",
      value: orders?.length || 0,
      icon: FaClipboardList,
      description: "Orders received from customers"
    },
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: FaUserFriends,
      description: "Registered users in the system"
    }
  ];

  const getLatestOrders = () => {
    if (!orders?.length) return [];
    return orders.slice(0, 5).map(order => ({
      ...order,
      truncatedId: `#${order._id.slice(-6)}`
    }));
  };

  const lowStockProducts = useMemo(() => {
    if (!products?.length) return [];
    return products
      .map((p) => ({
        ...p,
        computedStock: p.hasVariants
          ? p.totalStock
          : p.stock ?? p.totalStock ?? 0,
      }))
      .filter((p) => p.computedStock <= 5)
      .sort((a, b) => a.computedStock - b.computedStock)
      .slice(0, 5);
  }, [products]);

  // Data for Category Distribution Pie Chart
  const categoryData = useMemo(() => {
    if (!products?.length) return [];
    const counts = products.reduce((acc, product) => {
      const catName = product.category?.name || "Uncategorized";
      acc[catName] = (acc[catName] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);



  // Data for Revenue Area Chart (Mocking dates if not present)
  const revenueChartData = useMemo(() => {
    if (!orders?.length) return [];

    // Sort orders by date if available, otherwise use index
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      return dateA - dateB;
    });

    let cumulativeRevenue = 0;
    return sortedOrders.map((order, index) => {
      cumulativeRevenue += (order.totalAmount || 0);
      const date = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        : `Order ${index + 1}`;
      return {
        name: date,
        revenue: (order.totalAmount || 0),
        total: cumulativeRevenue
      };
    }).slice(-10); // Show last 10 orders for better visibility
  }, [orders]);

  // Data for Top Selling Products
  const topProductsData = useMemo(() => {
    if (!orders?.length) return [];
    const productCounts = {};
    orders.forEach(order => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(p => {
          if (p.name) {
            productCounts[p.name] = (productCounts[p.name] || 0) + (p.quantity || 1);
          }
        });
      }
    });

    return Object.entries(productCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  const COLORS = ['#34785A', '#4F7EC9', '#C77B18', '#DC4C4C', '#205039', '#8A928D'];

  return (
    <div className="py-8 px-6 space-y-6 bg-background min-h-screen">
      <Heading title="Dashboard" description="Here's what's happening with your store today." />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Overview Chart */}
        <Card className="lg:col-span-2 border border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">
              Revenue & Order Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34785A" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#34785A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0ED" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#8A928D' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#8A928D' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E7E9E5', boxShadow: '0 4px 12px rgba(23,32,27,0.08)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#34785A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Distribution Pie Chart */}
        <Card className="border border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Product Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E7E9E5', boxShadow: '0 4px 12px rgba(23,32,27,0.08)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders List */}
        <Card className="border border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground">Recent Orders</CardTitle>
            <Badge variant="secondary" className="text-[10px] uppercase">Recent 5</Badge>
          </CardHeader>
          <CardContent>
            {getLatestOrders().length > 0 ? (
              <div className="space-y-1">
                {getLatestOrders().map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 hover:bg-secondary rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-xs">
                        {order.user?.fullname?.charAt(0) || 'A'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{order.user?.fullname || 'Anonymous'}</span>
                        <span className="text-xs text-text-muted-2">{order.truncatedId}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-foreground">₹{order.totalAmount?.toLocaleString()}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 flex flex-col items-center gap-2">
                <FaFolderOpen className="text-text-muted-2 text-3xl" />
                <p className="text-text-secondary text-sm">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="border border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FaTrophy className="text-warning" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProductsData.length > 0 ? (
              <div className="space-y-2">
                {topProductsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 hover:bg-secondary rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{item.quantity} sold</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 flex flex-col items-center gap-2">
                <FaBoxOpen className="text-text-muted-2 text-3xl" />
                <p className="text-text-secondary text-sm">No sales data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card className="border border-border shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-2.5 hover:bg-secondary rounded-lg transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg overflow-hidden bg-secondary shrink-0">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground truncate">{product.name}</span>
                    </div>
                    <Badge variant={product.computedStock === 0 ? "danger" : "warning"} className="shrink-0">
                      {product.computedStock === 0 ? "Out of stock" : `${product.computedStock} left`}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 flex flex-col items-center gap-2">
                <FaBoxOpen className="text-text-muted-2 text-3xl" />
                <p className="text-text-secondary text-sm">Stock levels look healthy</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
