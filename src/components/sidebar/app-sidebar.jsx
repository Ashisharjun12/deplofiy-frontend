"use client"

import * as React from "react"
import { useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  Layers,
} from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({
  ...props
}) {
  const { data: session } = useSession();
  const location = useLocation();

  const data = React.useMemo(() => {
    const user = session?.user ? {
      name: session.user.name || "User",
      email: session.user.email || "",
      avatar: session.user.image || "",
    } : {
      name: "Guest",
      email: "",
      avatar: "",
    };

    const teams = [
      {
        name: "Deplofiy Platform",
        logo: Shield,
        plan: session?.user?.role === 'admin' ? "Admin" : "User",
      },
    ];

    const navMain = [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
        isActive: location.pathname === "/admin" || location.pathname === "/admin/",
        items: [],
      },
      {
        title: "Frameworks",
        url: "/admin/frameworks",
        icon: Layers,
        isActive: location.pathname === "/admin/frameworks",
        items: [],
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
        isActive: location.pathname === "/admin/users",
        items: [],
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        isActive: location.pathname === "/admin/settings",
        items: [],
      },
    ];

    return {
      user,
      teams,
      navMain,
      projects: [],
    };
  }, [session, location]);

  if (!session) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
