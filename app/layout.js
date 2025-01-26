// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/App-sidebar";
import Appheader from "@/components/App-header";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/contexts/AntD";
import { Toaster } from "@/components/ui/toaster";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  twitter: {
    title: {
      default: "AJL WebCraft Dashboard",
      template: `%s | AJL Dashboard`,
    },
    description: {
      default:
        "Dashboard to overview clients, revenue and organize client's works.",
      template: `%s`,
    },
  },
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["/apple-touch-icon.png"],
  },
  title: {
    template: "%s | AJL Webcraft Dashboard",
    default: "AJL WebCraft",
  },
  description: {
    default:
      "Dashboard to overview clients, revenue and organize client's works.",
    template: `%s | asja`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-[--background] text-[--text-color] antialiased`}>
        <AntdRegistry>
          <SidebarProvider>
            <ThemeProvider>
              <AppSidebar />
              <SidebarInset>
                <main>
                  <Appheader />
                  <Toaster />
                  {children}
                </main>
              </SidebarInset>
            </ThemeProvider>
          </SidebarProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
