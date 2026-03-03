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
      <SidebarHeader>
        <div className="flex items-center gap-3 w-full mt-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-center size-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <img
              src="/logo.svg"
              alt="Shopcart CMS Logo"
              className="size-8 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Shopcart
            </span>
            <span className="truncate text-xs font-medium text-slate-500">
              Admin Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ---- Main Nav ---- */}
      <SidebarContent className="mt-2">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* ---- Footer / User ---- */}
      <SidebarFooter>
        <UserMenu user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
