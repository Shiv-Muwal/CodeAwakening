// src/helper.js
export const navLinks = [
  { name: "Home", href: "#Home" },
  { name: "About", href: "#About" },
  { name: "Skills", href: "#Skills" },
  { name: "Projects", href: "#MyProject" },
  { name: "Contact Me", href: "#Contact" },
];
import { Github, Linkedin, Instagram, Send } from "lucide-react";

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
