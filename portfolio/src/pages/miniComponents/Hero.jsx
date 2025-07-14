import {
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Send,
  Sparkles,
  Download,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ACTION_BUTTON_LINKS, SOCIAL_ICON_LINKS } from "../common/Helper";

const Hero = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gradient-primary via-gradient-secondary to-gradient-accent opacity-10"></div>

        <div className="w-full container relative z-10">
          <div className="flex items-center gap-3 mb-6 animate-pulse">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full h-3 w-3 animate-bounce"></div>
            <p className="text-lg font-medium">Loading your portfolio...</p>
          </div>
          <div className="space-y-6">
            <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse w-3/4"></div>
            <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10"></div>

        <div className="w-full container relative z-10 text-center">
          <div className="modern-card p-8 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <span className="bg-red-500 rounded-full h-3 w-3 animate-pulse"></span>
              <p className="text-lg font-medium text-red-500">Connection Error</p>
            </div>
            <p className="text-red-400 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-glow"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Retry Loading
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Provide fallback values if user data is missing
  const userData = user || {};
  const {
    instagramURL,
    linkedInURL,
    githubURL,
    discordURL,
    aboutMe = "Welcome to my portfolio!",
    resume = null,
    email,
    phone
  } = userData;

  // Clean URL helper function
  const cleanURL = (url) => {
    if (!url || url === "undefined" || url === "null") {
      return null;
    }
    return url;
  };

  // Get cleaned URLs
  const cleanInstagramURL = cleanURL(instagramURL);
  const cleanLinkedInURL = cleanURL(linkedInURL);
  const cleanGithubURL = cleanURL(githubURL);
  const cleanDiscordURL = cleanURL(discordURL);
  const cleanEmail = cleanURL(email);
  const cleanPhone = cleanURL(phone);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-hero-pattern">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gradient-accent to-gradient-pink rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-gradient-blue to-gradient-cyan rounded-full opacity-5 blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Mouse follower effect */}
      <div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary opacity-5 blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      <div className="w-full container relative z-10 text-center lg:text-left" id="Home">
        {/* Status indicator */}
        <div className="flex items-center pt-16 gap-3 mb-4 justify-center lg:justify-start animate-fade-in">
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full h-3 w-3 animate-pulse shadow-glow"></span>
          <p className="text-lg font-medium bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Available for opportunities
          </p>
          <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
        </div>

        {/* Main heading */}
        <h3 className="block text-4xl mb-3">Hey, I'm</h3>
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 heading-primary">
            Shivdayal Singh
          </h1>
        </div>

        {/* Typewriter effect */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-muted-foreground tracking-wider">
            <Typewriter
              words={[
                "FULLSTACK DEVELOPER",
                "FRONTEND SPECIALIST",
                "DEVELOPMENT ENTHUSIAST",
                "DEDICATED CODER"
              ]}
              loop={50}
              cursor
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h2>
        </div>

        {/* Social links */}
        <div className="flex justify-center lg:justify-start mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="modern-card p-4 flex gap-6 items-center hover-lift">
            {SOCIAL_ICON_LINKS.map(({ id, icon: Icon, urlKey, gradient, color }) => {
              const url = user?.[urlKey];
              if (!url || url === "undefined" || url === "null") return null;

              return (
                <a key={id} href={url} target="_blank" rel="noopener noreferrer" className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
                  <Icon className={`relative ${color} w-8 h-8 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-glow`} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {ACTION_BUTTON_LINKS.map(({ id, icon: Icon, label, urlKey, buttonClass, isResume }) => {
            const rawLink = user?.[urlKey];
            const url = isResume ? rawLink?.url : rawLink;
            if (!url || url === "undefined" || url === "null") return null;

            return (
              <a key={id} href={url} target="_blank" rel="noopener noreferrer">
                <Button className={`group relative overflow-hidden ${buttonClass} px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-modern-lg w-full sm:w-auto`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Icon className="w-5 h-5 mr-3 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Button>
              </a>
            );
          })}
        </div>


        {/* About description */}
        <div className="max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '1s' }}>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
            {aboutMe}
          </p>
        </div>

        {/* Decorative gradient line */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-gradient-primary to-transparent rounded-full opacity-50"></div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;