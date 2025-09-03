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
          >
            <Link
              to={item.url}
              aria-label={item.title}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                "hover:bg-accent/80 group",
                isActive && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-accent -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              
              <div className={cn(
                "relative flex items-center justify-center w-6 h-6",
                "transition-transform group-hover:scale-110",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.icon && <item.icon className="w-5 h-5" />}
              </div>

              <div className="flex items-center justify-between flex-1">
                <span className={cn(
                  "text-sm transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )}>
                  {item.title}
                </span>
                
                {item.badge && (
                  <Badge variant={isActive ? "default" : "secondary"} className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          </SidebarMenuButton>
        );
      })}
    </SidebarMenu>
  );
}
