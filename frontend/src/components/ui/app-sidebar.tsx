import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Discovery",
      url: "/suggest",
    },
    {
      title: "Chat",
      url: "/#",
    },
    {
      title: "Likes",
      url: "/likes",
    },
    {
      title: "Visitors",
      url: "/visitors",
    },
    {
      title: "Calendar",
      url: "#",
    },
    {
      title: "Me",
      url: "/profile",
    }
  ]
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    render={<a href={item.url} />}
                  >
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
