import { useContext, useMemo } from "react";
import { AppContext } from "@/Context/AppContext";
import Heading from "../components/Heading";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRupeeSign, FaClipboardList, FaUserFriends, FaChartLine } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Analytics = () => {
  const { products, orders, users, totalRevenue } = useContext(AppContext);

  const avgOrderValue = orders?.length ? Math.round(totalRevenue / orders.length) : 0;

  const categorySales = useMemo(() => {
    if (!orders?.length || !products?.length) return [];
    const productCategoryMap = new Map(
      products.map((p) => [p._id, p.category?.name || "Uncategorized"])
    );
    const totals = {};
    orders.forEach((order) => {
      order.products?.forEach((item) => {
        const catName = productCategoryMap.get(item.product) || "Uncategorized";
        totals[catName] = (totals[catName] || 0) + (item.price || 0) * (item.quantity || 1);
      });
    });
    return Object.entries(totals).map(([name, revenue]) => ({ name, revenue }));
  }, [orders, products]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading title="Analytics" description="Understand store performance using metrics and trends." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={totalRevenue?.toLocaleString() || 0} prefix="₹" icon={FaRupeeSign} />
        <StatCard title="Total Orders" value={orders?.length || 0} icon={FaClipboardList} />
        <StatCard title="Total Customers" value={users?.length || 0} icon={FaUserFriends} />
        <StatCard title="Avg. Order Value" value={avgOrderValue.toLocaleString()} prefix="₹" icon={FaChartLine} />
      </div>

      <Card className="border border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categorySales.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0ED" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8A928D" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8A928D" }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E7E9E5" }} />
                  <Bar dataKey="revenue" fill="#34785A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon={MdBarChart} title="Not enough data yet" description="Category revenue breakdown will appear once orders come in." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
