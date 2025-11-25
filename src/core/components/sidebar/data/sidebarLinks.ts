import { Users } from "lucide-react";

export const sidebarLinks = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [],
  navMain: [
    {
      title: "PeopleFlow",
      url: "/recruitment",
      icon: Users,
      items: [
        {
          title: "Candidatos",
          url: "/candidates",
        },
      ],
    },
  ],
};
