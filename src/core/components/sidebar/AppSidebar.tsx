"use client";
import * as React from "react";
import { sidebarLinks } from "./data/sidebarLinks";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../shadcn/sidebar";
import { NavUser } from "./NavUser";
import { NavMain } from "./NavMain";
import { useAuth } from "@/core/shared/hooks/useAuth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userData = user
    ? {
      name: user.name || "Usuario",
      email: user.email || "usuario@bdp.com",
      avatar: user.image || "/placeholder-avatar.jpg",
    }
    : {
      name: "Usuario",
      email: "usuario@bdp.com",
      avatar: "/placeholder-avatar.jpg",
    };

  // Si no hay usuario, no mostrar el NavUser
  if (!user) {
    return (
      <Sidebar collapsible="icon" {...props} variant="floating">
        <SidebarContent>
          <NavMain items={sidebarLinks.navMain} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader>
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarLinks.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
