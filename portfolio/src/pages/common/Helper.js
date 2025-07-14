import { Instagram, Linkedin, Github, Send, Download } from "lucide-react";

export const navLinks = [
  { name: "Home", href: "#Home" },
  { name: "About", href: "#About" },
  { name: "Skills", href: "#Skills" },
  { name: "Projects", href: "#MyProject" },
  { name: "Contact Me", href: "#Contact" },
];
export const SOCIAL_LINKS = (user) => [
  {
    url: user?.githubURL,
    Icon: Github,
    label: "GitHub",
    color: "text-foreground",
  },
  {
    url: user?.linkedInURL,
    Icon: Linkedin,
    label: "LinkedIn",
    color: "text-blue-600",
  },
  {
    url: user?.instagramURL,
    Icon: Instagram,
    label: "Instagram",
    color: "text-pink-500",
  },
  {
    url: user?.discordURL,
    Icon: Send,
    label: "Discord",
    color: "text-indigo-500",
  },
];
export const SOCIAL_ICON_LINKS = [
  {
    id: "instagram",
    icon: Instagram,
    urlKey: "instagramURL",
    gradient: "from-pink-500 to-purple-600",
    color: "text-pink-500",
  },
  {
    id: "linkedin",
    icon: Linkedin,
    urlKey: "linkedInURL",
    gradient: "from-blue-500 to-cyan-600",
    color: "text-sky-500",
  },
  {
    id: "discord",
    icon: Send,
    urlKey: "discordURL",
    gradient: "from-indigo-500 to-purple-600",
    color: "text-indigo-500",
  },
];

export const ACTION_BUTTON_LINKS = [
  {
    id: "github",
    icon: Github,
    label: "View GitHub",
    urlKey: "githubURL",
    buttonClass:
      "bg-gradient-to-r from-gradient-primary to-gradient-secondary hover:from-gradient-secondary hover:to-gradient-accent text-white",
  },
  {
    id: "resume",
    icon: Download,
    label: "Download Resume",
    urlKey: "resume",
    isResume: true,
    buttonClass:
      "bg-transparent border-2 border-gradient-primary hover:bg-gradient-to-r hover:from-gradient-primary hover:to-gradient-secondary hover:border-transparent text-gradient-primary hover:text-white",
  },
];
