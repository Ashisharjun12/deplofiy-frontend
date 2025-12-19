"use client"

import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Plus,
  FolderKanban,
  Settings,
  Rocket,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { NavMain } from "@/components/sidebar/nav-main"
import { WorkspaceNavUser } from "@/components/sidebar/workspace-nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function WorkspaceSidebar({
  ...props
}) {
  const { data: session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  const navMain = [
    {
      title: "Add Project",
      url: "/workspace/add-project",
      icon: Plus,
      isActive: location.pathname === "/workspace/add-project",
      items: [],
    },
    {
      title: "All Projects",
      url: "/workspace/projects",
      icon: FolderKanban,
      isActive: location.pathname === "/workspace/projects" || location.pathname === "/workspace",
      items: [],
    },
    {
      title: "Settings",
      url: "/workspace/settings",
      icon: Settings,
      isActive: location.pathname === "/workspace/settings",
      items: [],
    },
  ];

  const user = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email || "",
    avatar: session.user.image || "",
  } : {
    name: "Guest",
    email: "",
    avatar: "",
  };

  if (!session) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <div 
          className="flex items-center gap-3 px-3 py-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
            <Rocket className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-base">Deplofiy</span>
            <span className="truncate text-xs text-muted-foreground">Workspace</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <WorkspaceNavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

