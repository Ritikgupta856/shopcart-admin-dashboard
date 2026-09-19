import {
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NavMain({ label, items }) {
  const location = useLocation();

  return (
    <div className="px-2">
      {label && (
        <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted-2">
          {label}
        </p>
      )}
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isActive = location.pathname === item.url;

          return (
            <SidebarMenuButton key={item.title} tooltip={item.title} asChild className="h-9">
              <Link
                to={item.url}
                aria-label={item.title}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-text-secondary hover:bg-secondary hover:text-foreground"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                <span className="tracking-tight">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          );
        })}
      </SidebarMenu>
    </div>
  );
}
