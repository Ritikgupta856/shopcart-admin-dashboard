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
import { useUser } from "@clerk/clerk-react";
import {
  MdDashboard,
  MdCategory,
  MdShoppingCart,
  MdListAlt,
  MdPeople,
} from "react-icons/md";

export function AdminSidebar({ ...props }) {
  const { user } = useUser();

  const data = {
    user: {
      name: user?.fullName || "Guest User",
      email: user?.primaryEmailAddress?.emailAddress || "No Email",
      avatar: user?.imageUrl || "",
    },

    navMain: [
      { title: "Dashboard", url: "/", icon: MdDashboard },
      { title: "Categories", url: "/categories", icon: MdCategory },
      { title: "Products", url: "/products", icon: MdShoppingCart },
      { title: "Orders", url: "/orders", icon: MdListAlt },
      { title: "Users", url: "/users", icon: MdPeople },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ---- Header ---- */}
      <SidebarHeader>
        <div className="flex items-center gap-3 w-full px-2 py-3 rounded-lg hover:bg-accent/50 transition">
          <img
            src="/logo.svg"
            alt="Shopcart CMS Logo"
            className="size-9 rounded-lg"
          />
          <div className="flex flex-col text-left">
            <span className="truncate text-base font-semibold">
              Shopcart Admin
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Manage your store
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ---- Main Nav ---- */}
      <SidebarContent className="mt-4">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* ---- Footer / User ---- */}
      <SidebarFooter className="border-t pt-3">
        <UserMenu user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
