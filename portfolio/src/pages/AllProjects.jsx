import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Folder, ExternalLink, Github, Calendar, ArrowLeft, Eye, Search, Filter } from "lucide-react";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const getMyProjects = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://codeawakening.onrender.com/api/v1/project/getall",
          { withCredentials: true }
        );
        setProjects(data.projects);
        setFilteredProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };
    getMyProjects();
  }, []);

  // Filter projects based on search term and category
  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category (if you have categories in your projects)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(project => 
        project.category === selectedCategory
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory]);

  // Get unique categories from projects
  const categories = ["all", ...new Set(projects.map(project => project.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center mb-16">
            <h1 className="heading-secondary text-gradient">All Projects</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
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
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Page header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Folder className="w-8 h-8 text-gradient-primary" />
            <span className="text-lg font-medium text-muted-foreground uppercase tracking-wider">
              Complete Portfolio
            </span>
          </div>
          <h1 className="heading-secondary mb-4">
            <span className="text-gradient">All Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my complete collection of projects showcasing various technologies and solutions.
          </p>
        </div>

        {/* Search and filter controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-primary focus:border-transparent"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gradient-primary focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Projects grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <Link 
                to={`/project/${project._id}`} 
                key={project._id}
                className="group block animate-scale-in"
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
                          <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform duration-300 rotate-180" />
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

                    {/* Tech stack */}
                    {project.technologies && project.technologies.length > 0 && (() => {
                      const technologiesList = project.technologies.split(", ");
                      return (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {technologiesList.slice(0, 5).map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10 text-gradient-primary text-xs px-2 py-1 rounded-md font-medium border border-gradient-primary/20"
                            >
                              {tech}
                            </span>
                          ))}
                          {technologiesList.length > 5 && (
                            <span className="text-muted-foreground text-xs px-2 py-1">
                              +{technologiesList.length - 5} more
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
        ) : (
          /* Empty state for filtered results */
          <div className="text-center py-16">
            <div className="modern-card p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gradient mb-4">No Projects Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                className="text-gradient-primary border-gradient-primary hover:bg-gradient-primary hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;