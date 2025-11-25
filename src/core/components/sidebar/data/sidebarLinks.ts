import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Landmark,
} from "lucide-react";

export const sidebarLinks = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Candidatos",
      url: "Candidates",
      icon: Landmark,
      items: [
        {
          title: "Candidatos",
          url: "/candidates",
        },
      ],
    },
  ],
};
