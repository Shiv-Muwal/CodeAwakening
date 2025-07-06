import {
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  // Provide fallback values if user data is missing
  const userData = user || {};
  const {
    instagramURL = "#",
    facebookURL = "#",
    linkedInURL = "#",
    twitterURL = "#",
    githubURL = "#",
    aboutMe = "Welcome to my portfolio!",
    resume = null
  } = userData;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-green-400 rounded-full h-2 w-2"></span>
        <p>Online</p>
      </div>
      <h1 className="overflow-x-hidden text-[1.3rem] sm:text-[1.75rem] 
      md:text-[2.2rem] lg:text-[2.8rem] tracking-[2px] mb-4">
        Hey, I'm Zeeshan
      </h1>
      <h1 className="text-tubeLight-effect overflow-x-hidden text-[1.3rem] 
      sm:text-[1.75rem] md:text-[2.2rem] lg:text-[2.8rem] tracking-[15px]">
        <Typewriter
          words={["FULLSTACK DEVELOPER", "YOUTUBER", "FREELANCER"]}
          loop={50}
          cursor
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </h1>
      <div className="w-fit px-5 py-2 bg-slate-50 rounded-[20px] flex gap-5 
      items-center mt-4 md:mt-8 lg:mt-10">
        <Link to={"https://www.youtube.com/@CodeWithZeeshu"} target="_blank">
          <Youtube className="text-red-500 w-7 h-7"/>
        </Link>
        {instagramURL && instagramURL !== "#" && (
          <Link to={instagramURL} target="_blank">
            <Instagram className="text-pink-500 w-7 h-7" />
          </Link>
        )}
        {facebookURL && facebookURL !== "#" && (
          <Link to={facebookURL} target="_blank">
            <Facebook className="text-blue-800 w-7 h-7" />
          </Link>
        )}
        {linkedInURL && linkedInURL !== "#" && (
          <Link to={linkedInURL} target="_blank">
            <Linkedin className="text-sky-500 w-7 h-7" />
          </Link>
        )}
        {twitterURL && twitterURL !== "#" && (
          <Link to={twitterURL} target="_blank">
            <Twitter className="text-blue-800 w-7 h-7" />
          </Link>
        )}
      </div>
      <div className="mt-4 md:mt-8 lg:mt-10  flex gap-3">
        {githubURL && githubURL !== "#" && (
          <Link to={githubURL} target="_blank">
            <Button className="rounded-[30px] flex items-center gap-2 flex-row">
              <span>
                <Github />
              </span>
              <span>Github</span>
            </Button>
          </Link>
        )}
        {resume && resume.url && (
          <Link to={resume.url} target="_blank">
            <Button className="rounded-[30px] flex items-center gap-2 flex-row">
              <span>
                <ExternalLink />
              </span>
              <span>Resume </span>
            </Button>
          </Link>
        )}
      </div>
      <p className="mt-8 text-xl tracking-[2px]">{aboutMe}</p>
      <hr className="my-8 md::my-10 " />
    </div>
  );
};

export default Hero;
