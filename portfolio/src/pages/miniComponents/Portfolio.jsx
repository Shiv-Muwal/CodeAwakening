import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Folder, ExternalLink, Github, Calendar, ArrowRight, Eye } from "lucide-react";

const Portfolio = () => {
  const [viewAll, setViewAll] = useState(false);
  const [projects, setProjects] = useState([]);
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

    const element = document.getElementById('portfolio-section');
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
    const getMyProjects = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://codeawakening.onrender.com/api/v1/project/getall",
          { withCredentials: true }
        );
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    getMyProjects();
  }, []);

  const displayedProjects = viewAll ? projects : projects.slice(0, 6);

  if (loading) {
    return (
      <div id="portfolio-section" className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-secondary text-gradient">My Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="modern-card p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="portfolio-section" className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-20 w-40 h-40 bg-gradient-to-r from-gradient-accent to-gradient-pink rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-20 w-60 h-60 bg-gradient-to-r from-gradient-blue to-gradient-cyan rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <Folder className="w-8 h-8 text-gradient-primary" />
            <span className="text-lg font-medium text-muted-foreground uppercase tracking-wider">
              Portfolio Showcase
            </span>
          </div>
          <h2 className="heading-secondary mb-6">
            <span className="text-gradient">My Work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of projects that showcase my skills and creativity in web development.
          </p>
        </div>

        {/* Projects grid */}
        {projects && projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedProjects.map((project, index) => (
                <Link 
                  to={`/project/${project._id}`} 
                  key={project._id}
                  className={`group block ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="modern-card p-0 overflow-hidden hover-lift h-full">
                    {/* Project image */}
                    <div className="relative overflow-hidden">
                      <div className="aspect-video w-full">
                        {project.projectBanner && project.projectBanner.url ? (
                          <img
                            src={project.projectBanner.url}
                            alt={project.title || 'Project'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gradient-primary to-gradient-secondary flex items-center justify-center">
                            <Folder className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                      </div>
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-white mb-2">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">View Project</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-white/80 text-xs">
                              <Calendar className="w-3 h-3" />
                              <span>Recent</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                          Live
                        </div>
                      </div>
                    </div>

                    {/* Project info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gradient transition-colors duration-300">
                        {project.title || 'Untitled Project'}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description || 'A showcase of modern web development practices and design principles.'}
                      </p>

                      {/* Tech stack (if available) */}
                      {project.technologies && project.technologies.length > 0 && (() => {
                        const technologiesList = project.technologies.split(", ");
                        return (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {technologiesList.slice(0, 3).map((tech, techIndex) => (
                              <span 
                                key={techIndex}
                                className="bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10 text-gradient-primary text-xs px-2 py-1 rounded-md font-medium border border-gradient-primary/20"
                              >
                                {tech}
                              </span>
                            ))}
                            {technologiesList.length > 3 && (
                              <span className="text-muted-foreground text-xs px-2 py-1">
                                +{technologiesList.length - 3} more
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {/* Action buttons */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-gradient-primary text-sm font-medium">
                          <ExternalLink className="w-4 h-4" />
                          <span>View Details</span>
                        </div>
                        
                        {project.githubURL && (
                          <a 
                            href={project.githubURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-gradient-primary transition-colors duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gradient-primary to-gradient-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Show more/less button */}
            {projects.length > 6 && (
              <div className={`text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                <Button 
                  onClick={() => setViewAll(!viewAll)}
                  className="group bg-gradient-to-r from-gradient-primary to-gradient-secondary hover:from-gradient-secondary hover:to-gradient-accent text-white border-0 px-8 py-3 rounded-2xl font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-modern-lg"
                >
                  <span className="mr-2">{viewAll ? 'Show Less' : 'Show More Projects'}</span>
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${viewAll ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className={`text-center py-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="modern-card p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Folder className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gradient mb-4">No Projects Yet</h3>
              <p className="text-muted-foreground">
                Exciting projects are coming soon! Stay tuned for updates.
              </p>
            </div>
          </div>
        )}

        {/* Bottom call to action */}
        <div className={`mt-16 text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="modern-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gradient mb-4">Interested in Working Together?</h3>
            <p className="text-muted-foreground mb-6">
              I'm always excited to take on new challenges and bring innovative ideas to life.
            </p>
            <Button className="bg-gradient-to-r from-gradient-accent to-gradient-pink hover:from-gradient-pink hover:to-gradient-accent text-white border-0 px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-glow">
              <span className="mr-2">Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
