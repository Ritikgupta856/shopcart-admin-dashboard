import * as React from "react";
import { NavMain } from "@/components/NavMain";
import { UserMenu } from "@/components/UserMenu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import {
  MdDashboard,
  MdCategory,
  MdShoppingCart,
  MdListAlt,
  MdPeople,
  MdOpenInNew,
  MdBrandingWatermark,
  MdTune,
  MdInventory,
  MdRateReview,
  MdLocalOffer,
  MdPayment,
  MdViewCarousel,
  MdLocalFireDepartment,
  MdBarChart,
  MdDescription,
} from "react-icons/md";

const STORE_URL = import.meta.env.VITE_STORE_URL || "/";

export function AdminSidebar({ ...props }) {
  const { user } = useContext(AuthContext);

  const data = {
    user: {
      name: user?.fullname || "Guest User",
      email: user?.email || "No Email",
      avatar: "",
    },
  };

  const overviewItems = [{ title: "Dashboard", url: "/", icon: MdDashboard }];
  const catalogItems = [
    { title: "Products", url: "/products", icon: MdShoppingCart },
    { title: "Categories", url: "/categories", icon: MdCategory },
    { title: "Brands", url: "/brands", icon: MdBrandingWatermark },
    { title: "Attributes", url: "/attributes", icon: MdTune },
    { title: "Inventory", url: "/inventory", icon: MdInventory },
    { title: "Reviews", url: "/reviews", icon: MdRateReview },
  ];
  const salesItems = [
    { title: "Orders", url: "/orders", icon: MdListAlt },
    { title: "Customers", url: "/users", icon: MdPeople },
    { title: "Coupons", url: "/coupons", icon: MdLocalOffer },
    { title: "Payments", url: "/payments", icon: MdPayment },
  ];
  const marketingItems = [
    { title: "Banners", url: "/banners", icon: MdViewCarousel },
    { title: "Deals", url: "/deals", icon: MdLocalFireDepartment },
  ];
  const analyticsItems = [
    { title: "Analytics", url: "/analytics", icon: MdBarChart },
    { title: "Reports", url: "/reports", icon: MdDescription },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border" {...props}>
      <SidebarHeader className="px-2 py-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex items-center justify-center size-8 rounded-lg bg-accent shrink-0">
            <img src="/logo.svg" alt="ShopCart logo" className="size-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="truncate text-sm font-semibold tracking-tight text-foreground">
              ShopCart
            </span>
            <span className="truncate text-[11px] text-text-muted-2">
              Admin
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pb-2 overflow-y-auto">
        <NavMain label="Overview" items={overviewItems} />
        <NavMain label="Catalog" items={catalogItems} />
        <NavMain label="Sales" items={salesItems} />
        <NavMain label="Marketing" items={marketingItems} />
        <NavMain label="Analytics" items={analyticsItems} />
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-border pt-2">
        <a
          href={STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 mx-2 rounded-lg text-sm text-text-secondary hover:bg-secondary hover:text-foreground transition-colors"
        >
          <MdOpenInNew className="w-4 h-4 shrink-0" />
          View Store
        </a>
        <UserMenu user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
