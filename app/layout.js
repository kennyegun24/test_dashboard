// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/contexts/AntD";
import ReduxProvider from "@/contexts/ReduxProvider";
import HomeProvider from "@/contexts/Home";
import RequestProvider from "@/contexts/RequestLLoading";

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
    default: "AJL Webcraft Dashboard",
  },
  description: {
    default:
      "Dashboard to overview clients, revenue and organize client's works.",
    template: `%s | Dashboard to overview clients, revenue and organize client's works.`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-[--background] text-[--text-color] antialiased`}>
        <AntdRegistry>
          <ThemeProvider>
            <ReduxProvider>
              <HomeProvider>
                <RequestProvider>{children}</RequestProvider>
              </HomeProvider>
            </ReduxProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
