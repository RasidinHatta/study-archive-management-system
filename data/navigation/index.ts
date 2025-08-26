import { IconDashboard, IconFile, IconHelp, IconMessage, IconSettings, IconUsers } from "@tabler/icons-react";

export const navData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpeg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin2",
      icon: IconDashboard,
    },
    {
      title: "Document",
      url: "/admin2/documents",
      icon: IconFile,
    },
    {
      title: "Comment",
      url: "/admin2/comments",
      icon: IconMessage,
    },
    {
      title: "User",
      url: "/admin2/users",
      icon: IconUsers,
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin2/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/admin2/help",
      icon: IconHelp,
    },
  ]
}

export const routeTitles: Record<string, string> = {
  "/admin2": "Dashboard Overview",
  "/admin2/documents": "Document Management",
  "/admin2/comments": "Comment Management",
  "/admin2/users": "User Management",
  "/admin2/settings": "Configuration",
  "/admin2/help": "Help & Support",
};