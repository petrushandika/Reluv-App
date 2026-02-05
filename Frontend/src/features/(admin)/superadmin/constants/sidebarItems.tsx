import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  Tag,
  BarChart3,
  Settings2,
  ShoppingCart,
} from "lucide-react"

export const superadminSidebarItems = [
  {
    label: "Overview",
    href: "/superadmin",
    icon: LayoutDashboard,
  },
  {
    label: "Stores",
    href: "/superadmin/stores",
    icon: Store,
  },
  {
    label: "Users",
    href: "/superadmin/users",
    icon: Users,
  },
  {
    label: "Products",
    href: "/superadmin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/superadmin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Categories",
    href: "/superadmin/categories",
    icon: Tag,
  },
  {
    label: "Analytics",
    href: "/superadmin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/superadmin/settings",
    icon: Settings2,
  },
]

