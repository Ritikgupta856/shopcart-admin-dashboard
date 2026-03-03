import { useContext, useMemo } from "react";
import Heading from "../components/Heading";
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
  //   FaTrendingUp,
  //   FaTrendingDown,
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
      color: "bg-green-500",
      description: "Total earnings from all orders"
    },
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: FaShoppingCart,
      color: "bg-blue-500",
      description: "Products available in store"
    },
    {
      title: "Total Orders",
      value: orders?.length || 0,
      icon: FaClipboardList,
      color: "bg-purple-500",
      description: "Orders received from customers"
    },
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: FaUserFriends,
      color: "bg-orange-500",
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="py-8 px-6 space-y-8 bg-gray-50/30 min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading title="Dashboard Overview" description="Comprehensive performance tracking" />
        <Badge variant="secondary" className="px-3 py-1 font-normal text-xs">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-all duration-300 border-none shadow-sm dark:bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  {stat.prefix && <span className="text-lg font-semibold text-muted-foreground">{stat.prefix}</span>}
                  <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FaRupeeSign className="text-green-500" />
              Revenue & Order Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#888' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#888' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Distribution Pie Chart */}
        <Card className="border-none shadow-sm dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Product Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders List */}
        <Card className="border-none shadow-sm dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
            <Badge variant="outline" className="text-xs uppercase">Recent 5</Badge>
          </CardHeader>
          <CardContent>
            {getLatestOrders().length > 0 ? (
              <div className="space-y-1">
                {getLatestOrders().map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {order.user?.fullname?.charAt(0) || 'A'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{order.user?.fullname || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">{order.truncatedId}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{order.totalAmount?.toLocaleString()}</span>
                      <Badge
                        variant={order.status === 'paid' ? 'success' : order.status === 'pending' ? 'warning' : 'destructive'}
                        className="text-[10px] h-5 capitalize"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center gap-2">
                <FaFolderOpen className="text-gray-300 text-4xl" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="border-none shadow-sm dark:bg-zinc-900 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              Top Selling Products
            </CardTitle>
            <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">
              Best Sellers
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {topProductsData.length > 0 ? (
              <div className="space-y-4">
                {topProductsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200 group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-900 dark:text-gray-100 font-bold text-sm group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
                        <span className="text-xs text-muted-foreground">High demand item</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.quantity} Units</p>
                        <p className="text-[10px] text-green-500 font-medium">Sold</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-gray-50 dark:bg-zinc-800">
                  <FaBoxOpen className="text-gray-300 text-4xl" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">No Sales Data</p>
                  <p className="text-xs text-muted-foreground">Top products will appear here once orders are placed</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;