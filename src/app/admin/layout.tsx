"use client";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <div className="flex h-[calc(100svh-4rem)] md:h-[calc(100svh-72px)]">
        <Sidebar className="border-r" collapsible="offcanvas">
          <SidebarHeader className="px-2 pt-3 pb-1">
            <Link href="/" className="text-sm underline">
              Back to app
            </Link>
          </SidebarHeader>
          <SidebarHeader className="flex items-center gap-2 text-lg font-medium px-2 py-3">
            <img src="/nest-logo.svg" alt="Nest logo" className="w-5 h-5" />
            <span>Admin</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                  <Link href="/admin">Overview</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/assets")}> 
                  <Link href="/admin/assets">Assets</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/compositions")}> 
                  <Link href="/admin/compositions">Compositions</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
