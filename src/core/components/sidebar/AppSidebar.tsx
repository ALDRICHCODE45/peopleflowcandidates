"use client";
import * as React from "react";
//import { useAuth } from "@/core/shared/hooks/use-auth";
//import { usePermissions } from "@/core/shared/hooks/use-permissions";
//import { filterSidebarLinks } from "./helpers/filterSidebarByPermissions";
import { sidebarLinks } from "./data/sidebarLinks";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../shadcn/sidebar";
import { NavUser } from "./NavUser";
import { NavMain } from "./NavMain";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
}) {
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
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarLinks.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
