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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  //   const { user } = useAuth();
  //   const { permissions } = usePermissions();

  // TODO: Manejar el caso cuando user es null/undefined
  const userData = {
    name: "Usuario",
    email: "usuario@bdp.com",
    avatar: "/placeholder-avatar.jpg",
  };

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
