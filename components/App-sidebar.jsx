import {
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  UserRoundCog,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Inbox,
  },
  {
    title: "Roles",
    url: "/roles",
    icon: UserRoundCog,
  },
  {
    title: "Audit Log",
    url: "/",
    icon: Calendar,
  },
  {
    title: "CMS",
    icon: Search,
    children: [
      {
        title: "Privacy Policy",
        url: "/cms/privacy-policy",
      },
      {
        title: "Terms & Conditions",
        url: "/cms/terms&conditions",
      },
      {
        title: "Blog",
        // url: "/cms/blogs",
        children: [
          {
            title: "All blogs",
            url: "/cms/blogs/all",
          },
          {
            title: "Write blog",
            url: "/cms/blogs/new",
          },
        ],
      },
      {
        title: "Services",
        // url: "/cms/services",
        children: [
          {
            title: "All services",
            url: "/cms/services/all",
          },
          {
            title: "New service",
            url: "/cms/services/new",
          },
        ],
      },
      {
        title: "Reviews",
        // url: "/cms/customers-reviews",
        children: [
          {
            title: "All reviews",
            url: "/cms/customers-reviews/all",
          },
          {
            title: "New Review",
            url: "/cms/customers-reviews/new",
          },
        ],
      },
      {
        title: "Logo and Company name",
        url: "/cms/logos-company-details",
      },
    ],
  },
  {
    title: "Management",
    icon: Users,
    children: [
      {
        title: "Social Media",
        url: "/management/social-media",
      },
      {
        title: "Leads",
        url: "/management/leads",
      },
      {
        title: "Sales",
        // url: "/management/sales",
        children: [
          {
            title: "Overview",
            url: "/management/sales",
          },
          {
            title: "Revenue",
            url: "/management/sales/calculator",
          },
        ],
      },
    ],
  },
  {
    title: "Settings",
    url: "/",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating" className="z-[999]">
      <Header />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AJL WebCraft</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return item?.children?.length > 0 ? (
                  <CollapseMenu key={item.title} item={item} />
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton className="text-[--text-color]" asChild>
                      <a className="text-[--text-color]" href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Footer />
    </Sidebar>
  );
}

const CollapseMenu = ({ item }) => {
  return (
    <SidebarMenuItem>
      <Collapsible
        className={`group/collapsible ${
          item.icon
            ? "[&[data-state=open]>button>svg:nth-child(3)]:rotate-90"
            : "[&[data-state=open]>button>svg:nth-child(2)]:rotate-90"
        }`}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child, index) =>
              child.children ? (
                <CollapseMenu key={index} item={child} />
              ) : (
                <SidebarMenuSubItem key={index}>
                  <SidebarMenuSubButton className="text-[--text-color]" asChild>
                    {child.url ? (
                      <a
                        href={child.url}
                        className="text-[14px] text-[--text-color]"
                      >
                        <span>{child.title}</span>
                      </a>
                    ) : (
                      <span className="text-[14px] text-[--text-color]">
                        {child.title}
                      </span>
                    )}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

const Footer = () => {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> Username
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem>
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

const Header = () => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <h3 className="font-[700] text-center">AJL Dashboard</h3>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
