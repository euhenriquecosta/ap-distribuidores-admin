"use client";

import * as React from "react";
import {
  Locate,
  Settings2,
} from "lucide-react";

import { NavUser } from "/src/@/components/nav-user";
import { TeamSwitcher } from "/src/@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "/src/@/components/ui/sidebar";
import { Icon } from "../assets/icon";
import { useAuth } from "../hooks/use-auth";
import { Distributor } from "../contexts/auth-context";
import { api } from "../services/api";
import { NavMain } from "./nav-main";


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
  const { getUserData } = useAuth();

  const [user, setUser] = React.useState<Distributor | null>(null);

  React.useEffect(() => {
    getUserData().then((data) => setUser(data));
  }, [getUserData]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser user={{
            name: `${user.FIRST_NAME} ${user.LAST_NAME}`,
            email: user.EMAIL,
            avatar: `${api.defaults.baseURL}/${user.AVATAR}`,
          }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
