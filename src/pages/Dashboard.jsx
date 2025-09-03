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
//   FaTrendingUp,
//   FaTrendingDown,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
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



  return (
    <div className="py-8 px-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading title="Dashboard" description="Overview of your store performance" />
        <Badge variant="outline" className="w-fit">
          Last updated: {new Date().toLocaleString()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-gray-900 transition-colors">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-1">
                  {stat.prefix && <span className="text-xl font-semibold text-muted-foreground">{stat.prefix}</span>}
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {getLatestOrders().length > 0 ? (
              <div className="space-y-4">
                {getLatestOrders().map((order, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{order._id}</Badge>
                      <span className="text-sm font-medium">{order.user?.fullname || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">₹{order.totalAmount?.toLocaleString()}</span>
                      <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No orders found
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
            
              <div className="p-4 rounded-lg bg-green-50">
                <p className="text-sm text-green-600 font-medium">Avg. Order Value</p>
                <p className="text-2xl font-bold text-green-700">
                  ₹{orders?.length ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}
                </p>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Category Distribution</h4>
              <div className="space-y-2">
                {products?.length > 0 ? (
                  Array.from(new Set(products.map(p => p.category?.name)))
                    .slice(0, 4)
                    .map((category, index) => {
                      const count = products.filter(p => p.category?.name === category).length;
                      const percentage = Math.round((count / products.length) * 100);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{category}</span>
                              <span className="text-sm text-muted-foreground">{percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No categories found
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;