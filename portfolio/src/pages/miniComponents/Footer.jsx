import React, { useState, useEffect } from "react";
import { BackToTop, Logo } from "../common/Icon";
import { Github, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import axios from "axios";
import { navLinks, SOCIAL_LINKS } from "../common/Helper";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://codeawakening.onrender.com/api/v1/user/me/portfolio",
          { withCredentials: true }
        );
        setUser(data.user);
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getMyProfile();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  // Helper function to clean URLs
  const cleanURL = (url) => {
    if (!url || url === "undefined" || url === "null") return null;
    return url;
  };

  // Extract user data with fallbacks
  const email = user?.email || 'contact@example.com';
  const githubURL = cleanURL(user?.githubURL);
  const linkedInURL = cleanURL(user?.linkedInURL);
  const instagramURL = cleanURL(user?.instagramURL);
  const discordURL = cleanURL(user?.discordURL);
  const phone = user?.phone || '+91 96713 55104';
  const location = user?.location || 'San Francisco, CA';

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo and Copyright Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-[2px]">PORTFOLIO</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Creating innovative digital experiences with passion and precision.
            </p>
            <p className="text-xs text-muted-foreground">
              © {currentYear} All rights reserved.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail />
                <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin />
                <span>{location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone />
                <span>{phone}</span>
              </div>
            </div>
          </div>
          {/* Social Media Icons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Me</h3>
            <div className="flex space-x-4">
              {SOCIAL_LINKS(user).map(
                ({ url, Icon, label, color }, index) =>
                  url && (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      aria-label={label}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                    </a>
                  )
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using React & Tailwind CSS
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <BackToTop />
        </button>
      )}
    </footer>
  );
};

export default Footer;