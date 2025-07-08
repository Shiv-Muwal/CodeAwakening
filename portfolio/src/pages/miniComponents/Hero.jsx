import {
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Hero = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-gray-400 rounded-full h-2 w-2"></span>
          <p>Loading...</p>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-16 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-400 rounded-full h-2 w-2"></span>
          <p>Error loading profile</p>
        </div>
        <div className="text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use actual user data with proper fallbacks
  const userData = user || {};
  const {
    fullName = "Developer",
    instagramURL,
    linkedInURL,
    githubURL,
    aboutMe = "Welcome to my portfolio!",
    resume
  } = userData;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-green-400 rounded-full h-2 w-2"></span>
        <p>Online</p>
      </div>
      <h1 className="overflow-x-hidden text-[1.3rem] sm:text-[1.75rem] 
      md:text-[2.2rem] lg:text-[2.8rem] tracking-[2px] mb-4">
        Hey, I'm {fullName}
      </h1>
      <h1 className="text-tubeLight-effect overflow-x-hidden text-[1.3rem] 
      sm:text-[1.75rem] md:text-[2.2rem] lg:text-[2.8rem] tracking-[15px]">
        <Typewriter
          words={["FULLSTACK DEVELOPER",
            "FRONTEND SPECIALIST",
            "WEB DEVELOPMENT ENTHUSIAST",
            "DEDICATED CODER"]}
          loop={50}
          cursor
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </h1>
      <div className="w-fit px-5 py-2 bg-slate-50 rounded-[20px] flex gap-5 
      items-center mt-4 md:mt-8 lg:mt-10">
        {/* Fixed: Use anchor tags for external links */}
        {instagramURL && (
          <a href={instagramURL} target="_blank" rel="noopener noreferrer">
            <Instagram className="text-pink-500 w-7 h-7" />
          </a>
        )}
        {linkedInURL && (
          <a href={linkedInURL} target="_blank" rel="noopener noreferrer">
            <Linkedin className="text-sky-500 w-7 h-7" />
          </a>
        )}
      </div>
      <div className="mt-4 md:mt-8 lg:mt-10 flex gap-3">
        {/* Fixed: Use anchor tags for external GitHub link */}
        {githubURL && (
          <a href={githubURL} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-[30px] flex items-center gap-2 flex-row">
              <span>
                <Github />
              </span>
              <span>Github</span>
            </Button>
          </a>
        )}
        {/* Fixed: Resume URL check and anchor tag */}
        {resume && resume.url && (
          <a href={resume.url} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-[30px] flex items-center gap-2 flex-row">
              <span>
                <ExternalLink />
              </span>
              <span>Resume</span>
            </Button>
          </a>
        )}
      </div>
      <p className="mt-8 text-xl tracking-[2px]">{aboutMe}</p>
      <hr className="my-8 md:my-10" />
    </div>
  );
};

export default Hero;