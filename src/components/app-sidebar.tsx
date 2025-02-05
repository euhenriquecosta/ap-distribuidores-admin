"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  Locate,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "/src/@/components/nav-main";
import { NavUser } from "/src/@/components/nav-user";
import { TeamSwitcher } from "/src/@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "/src/@/components/ui/sidebar";
import { Logo } from "../assets/logo";
import { Icon } from "../assets/icon";

// This is sample data.
const data = {
  user: {
    name: "Henrique",
    email: "henriquecostapsilva@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "AP Pro - Distribuidores",
      logo: Icon,
      plan: "Unlimited",
    },
  ],
  navMain: [
    {
      title: "Aplicação",
      url: "#",
      icon: Locate,
      isActive: true,
      items: [
        {
          title: "Distribuidores",
          url: "#",
        },
        {
          title: "Histórico",
          url: "#",
        },
        {
          title: "Configurações",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
