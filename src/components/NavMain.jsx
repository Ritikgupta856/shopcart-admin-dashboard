import {
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function NavMain({ items }) {
  const location = useLocation();

  return (
    <SidebarMenu className="relative py-2">
      {items.map((item, index) => {
        const isActive = location.pathname === item.url;

        return (
          <SidebarMenuButton
            key={item.title}
            tooltip={item.title}
            asChild
            className="h-12"
          >
            <Link
              to={item.url}
              aria-label={item.title}
              className={cn(
                "relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
                "hover:bg-slate-100/80 group dark:hover:bg-zinc-800/80",
                isActive && "bg-white shadow-sm ring-1 ring-slate-200 text-primary font-semibold dark:bg-zinc-800 dark:ring-zinc-700"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 -z-10 dark:bg-zinc-800 dark:ring-zinc-700"
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                />
              )}

              <div className={cn(
                "relative flex items-center justify-center w-6 h-6",
                "transition-all duration-300 group-hover:scale-110",
                isActive ? "text-primary scale-110" : "text-slate-500 group-hover:text-primary"
              )}>
                {item.icon && <item.icon className="w-6 h-6" />}
              </div>

              <div className="flex items-center justify-between flex-1">
                <span className={cn(
                  "text-base transition-colors duration-300 tracking-tight",
                  isActive ? "text-primary" : "text-slate-600 group-hover:text-primary"
                )}>
                  {item.title}
                </span>

                {item.badge && (
                  <Badge variant={isActive ? "default" : "secondary"} className="ml-auto text-xs px-2 py-0.5">
                    {item.badge}
                  </Badge>
                )}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
            </Link>
          </SidebarMenuButton>
        );
      })}
    </SidebarMenu>
  );
}
