import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Code2, Zap, Star, TrendingUp } from "lucide-react";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('skills-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    const getMySkills = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://codeawakening.onrender.com/api/v1/skill/getall",
          { withCredentials: true }
        );
        setSkills(data.skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };
    getMySkills();
  }, []);

  // Skill categories for better organization
  const categorizeSkills = (skills) => {
    const categories = {
      frontend: [],
      backend: [],
      database: [],
      tools: [],
      other: []
    };

    skills.forEach(skill => {
      const title = skill.title.toLowerCase();
      if (title.includes('react') || title.includes('vue') || title.includes('angular') ||
        title.includes('html') || title.includes('css') || title.includes('javascript') ||
        title.includes('typescript') || title.includes('tailwind') || title.includes('next')) {
        categories.frontend.push(skill);
      } else if (title.includes('node') || title.includes('python') || title.includes('express') ||
        title.includes('django') || title.includes('flask') || title.includes('php') ||
        title.includes('java') || title.includes('spring')) {
        categories.backend.push(skill);
      } else if (title.includes('mongo') || title.includes('mysql') || title.includes('postgres') ||
        title.includes('redis') || title.includes('firebase')) {
        categories.database.push(skill);
      } else if (title.includes('git') || title.includes('docker') || title.includes('aws') ||
        title.includes('vercel') || title.includes('figma') || title.includes('vscode')) {
        categories.tools.push(skill);
      } else {
        categories.other.push(skill);
      }
    });

    return categories;
  };

  const categorizedSkills = categorizeSkills(skills);

  const categoryConfig = {
    frontend: {
      title: "Frontend",
      icon: Code2,
      color: "from-blue-500 to-cyan-500",
      description: "Creating beautiful user interfaces"
    },
    backend: {
      title: "Backend",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      description: "Building robust server solutions"
    },
    database: {
      title: "Database",
      icon: Star,
      color: "from-green-500 to-emerald-500",
      description: "Managing and structuring data"
    },
    tools: {
      title: "Tools & DevOps",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      description: "Development and deployment tools"
    }
  };

  if (loading) {
    return (
      <div id="skills-section" className="py-8 md:py-12 lg:py-16">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-secondary text-gradient">Skills</h2>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="modern-card p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 mx-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="skills-section" className="py-8 md:py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-r from-gradient-blue to-gradient-cyan rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-gradient-to-r from-gradient-accent to-gradient-pink rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="container relative z-10" id="Skills">
        {/* Section header */}
        <div className={`text-center mb-8 sm:mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-gradient-primary" />
            <span className="text-base sm:text-lg font-medium text-muted-foreground uppercase tracking-wider">
              My Expertise
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">Skills & Technologies</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            A comprehensive overview of the technologies and tools I work with to bring ideas to life.
          </p>
        </div>

        {/* Skills by category */}
        <div className="space-y-16">
          {Object.entries(categoryConfig).map(([key, config], categoryIndex) => {
            const categorySkills = categorizedSkills[key];

            if (categorySkills.length === 0) return null;

            return (
              <div
                key={key}
                className={`${isVisible ? 'animate-fade-in flex flex-col items-center justify-center' : 'opacity-0'}`}
                style={{ animationDelay: `${categoryIndex * 0.2}s` }}
              >
                {/* Category header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${config.color} p-3 shadow-glow`}>
                    <config.icon className="w-full h-full text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">{config.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{config.description}</p>
                  </div>
                </div>

                {/* Skills grid */}
                <div className="flex flex-wrap items-center justify-center w-full gap-4 sm:gap-6">
                  {categorySkills.map((skill, index) => (
                    <div
                      key={skill._id}
                      className={`group modern-card flex flex-col items-center justify-center max-w-[172px] w-full p-4 sm:p-6 hover-lift text-center ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                      style={{ animationDelay: `${categoryIndex * 0.2 + index * 0.1}s` }}
                    >
                      <div className="relative mb-3 sm:mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-white dark:bg-gray-800 rounded-2xl p-2 sm:p-3 shadow-lg group-hover:shadow-glow transition-all duration-300">
                          <img
                            src={skill.svg && skill.svg.url}
                            alt={skill.title}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-gradient transition-colors duration-300">
                        {skill.title}
                      </h4>
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gradient-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* All other skills if any */}
          {categorizedSkills.other.length > 0 && (
            <div
              className={`${isVisible ? 'animate-fade-in flex flex-col items-center w-full justify-center' : 'opacity-0'}`}
              style={{ animationDelay: '0.8s' }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 p-3 shadow-glow">
                  <Star className="w-full h-full text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Other Skills</h3>
                  <p className="text-muted-foreground">Additional technologies and frameworks</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {categorizedSkills.other.map((skill, index) => (
                  <div
                    key={skill._id}
                    className={`group flex flex-col items-center justify-center max-w-[172px] w-full modern-card p-6 hover-lift text-center ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
                      <div className="relative w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-lg group-hover:shadow-glow transition-all duration-300">
                        <img
                          src={skill.svg && skill.svg.url}
                          alt={skill.title}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:text-gradient transition-colors duration-300">
                      {skill.title}
                    </h4>
                    <div className="absolute inset-0 bg-gradient-to-t from-gradient-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom stats or call to action */}
        <div className={`mt-8 sm:mt-16 text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <div className="modern-card p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-3 sm:mb-4">Continuous Learning</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2 sm:px-0">
              I'm always exploring new technologies and frameworks to stay at the forefront of development.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
              <div className="text-center p-2 sm:p-0">
                <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">{skills.length}+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Technologies</div>
              </div>
              <div className="text-center p-2 sm:p-0">
                <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">5+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center p-2 sm:p-0">
                <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">∞</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Learning Path</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
