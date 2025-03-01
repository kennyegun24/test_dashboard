"use client";

import Appheader from "@/components/App-header";
import { AppSidebar } from "@/components/App-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

import { createContext, useState } from "react";
// import "react-toastify/dist/ReactToastify.css";

export const HomeContext = createContext();

const HomeProvider = ({ children }) => {
  const routesToIgnore = [
    "/auth/login",
    "/auth/register",
    "/auth/forget_password",
    "/auth/confirm_email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  const pathname = usePathname();

  // const showTopNavBar = !TopNavRouteToIgnore.some((route) =>
  //   pathname.startsWith(route)
  // );
  const showNavBar = !routesToIgnore.some((route) =>
    pathname.startsWith(route)
  );
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <HomeContext.Provider value={{ toggle, collapsed }}>
      <div className="max-h-[100vh] text-[--text_color] overflow-x-hidden bg-[--background]">
        <SidebarProvider>
          {showNavBar && <AppSidebar />}
          <SidebarInset>
            <main>
              {showNavBar && <Appheader />}
              <Toaster />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </HomeContext.Provider>
  );
};

export default HomeProvider;
