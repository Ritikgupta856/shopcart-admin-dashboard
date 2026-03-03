import { ChevronsUpDown, LogOut } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function UserMenu({ user }) {
  const { isMobile } = useSidebar();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-300 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-zinc-800"
            >
              <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-sm dark:border-zinc-800">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-primary text-primary-foreground text-xs font-bold">
                  {user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight ml-1">
                <span className="truncate font-bold text-[15px] text-slate-900 dark:text-slate-100">
                  {user.name}
                </span>
                <span className="truncate text-[11px] font-medium text-slate-500">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
