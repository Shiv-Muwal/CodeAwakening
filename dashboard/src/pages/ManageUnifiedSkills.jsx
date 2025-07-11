import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Edit, 
  Search, 
  Filter, 
  Star, 
  TrendingUp,
  Code,
  Settings,
  Eye
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const ManageUnifiedSkills = () => {
  const navigateTo = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
    is_featured: ""
  });
  const [stats, setStats] = useState(null);

  const skillTypes = [
    { value: "", label: "All Types" },
    { value: "technical_skill", label: "Technical Skill" },
    { value: "software_application", label: "Software Application" },
    { value: "soft_skill", label: "Soft Skill" },
    { value: "framework", label: "Framework" },
    { value: "language", label: "Programming Language" },
    { value: "tool", label: "Tool" }
  ];

  const categories = [
    { value: "", label: "All Categories" },
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
    { value: "database", label: "Database" },
    { value: "devops", label: "DevOps" },
    { value: "testing", label: "Testing" },
    { value: "project_management", label: "Project Management" },
    { value: "communication", label: "Communication" },
    { value: "other", label: "Other" }
  ];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(
        `http://localhost:4000/api/v1/unified-skills/getall?${queryParams}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSkills(response.data.skills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/unified-skills/stats",
        { withCredentials: true }
      );

      if (response.data.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/api/v1/unified-skills/delete/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          fetchSkills();
          fetchStats();
        }
      } catch (error) {
        console.error("Error deleting skill:", error);
        toast.error(error.response?.data?.message || "Failed to delete skill");
      }
    }
  };

  const handleUpdateSkill = async (id, updateData) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/unified-skills/update/${id}`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingSkill(null);
        fetchSkills();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error(error.response?.data?.message || "Failed to update skill");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    fetchSkills();
    fetchStats();
  }, [filters]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'technical_skill':
        return <Code className="w-4 h-4" />;
      case 'software_application':
        return <Settings className="w-4 h-4" />;
      case 'framework':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'technical_skill':
        return 'bg-blue-100 text-blue-800';
      case 'software_application':
        return 'bg-green-100 text-green-800';
      case 'framework':
        return 'bg-purple-100 text-purple-800';
      case 'language':
        return 'bg-orange-100 text-orange-800';
      case 'tool':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Tabs defaultValue="skills" className="w-full">
        <div className="flex items-center justify-between p-6">
          <TabsList>
            <TabsTrigger value="skills">Skills Management</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          <Button onClick={() => navigateTo("/")}>
            Return to Dashboard
          </Button>
        </div>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Manage Unified Skills
              </CardTitle>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Featured</Label>
                  <Select value={filters.is_featured} onValueChange={(value) => handleFilterChange("is_featured", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Skills</SelectItem>
                      <SelectItem value="true">Featured Only</SelectItem>
                      <SelectItem value="false">Non-Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-48"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill) => (
                    <Card key={skill._id} className="relative">
                      {skill.is_featured && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-yellow-500">
                            <Star className="w-3 h-3" />
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={skill.svg?.url}
                              alt={skill.name}
                              className="w-10 h-10 object-contain rounded"
                            />
                            <div>
                              <CardTitle className="text-lg">{skill.name}</CardTitle>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className={getTypeColor(skill.type)}>
                                  {getTypeIcon(skill.type)}
                                  {skill.type.replace('_', ' ')}
                                </Badge>
                                <Badge variant="secondary">
                                  {skill.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingSkill(skill)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSkill(skill._id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Proficiency:</span>
                            <span className="font-medium">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            ></div>
                          </div>
                          
                          {skill.experience_years > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Experience:</span>
                              <span className="font-medium">{skill.experience_years} years</span>
                            </div>
                          )}
                          
                          {skill.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {skill.description}
                            </p>
                          )}
                          
                          {skill.tags && skill.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {skill.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {skill.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{skill.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {!loading && skills.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No skills found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Skills Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {stats.stats.totalSkills}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Skills</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {stats.stats.averageProficiency}%
                        </div>
                        <div className="text-sm text-muted-foreground">Average Proficiency</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {stats.typeBreakdown?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Skill Types</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal - You could implement a proper modal here */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit {editingSkill.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Proficiency</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  defaultValue={editingSkill.proficiency}
                  onChange={(e) => {
                    setEditingSkill(prev => ({
                      ...prev,
                      proficiency: parseInt(e.target.value)
                    }));
                  }}
                />
              </div>
              <div>
                <Label>Experience Years</Label>
                <Input
                  type="number"
                  min="0"
                  defaultValue={editingSkill.experience_years}
                  onChange={(e) => {
                    setEditingSkill(prev => ({
                      ...prev,
                      experience_years: parseInt(e.target.value)
                    }));
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingSkill.is_featured}
                  onChange={(e) => {
                    setEditingSkill(prev => ({
                      ...prev,
                      is_featured: e.target.checked
                    }));
                  }}
                />
                <Label>Featured Skill</Label>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={() => handleUpdateSkill(editingSkill._id, {
                  proficiency: editingSkill.proficiency,
                  experience_years: editingSkill.experience_years,
                  is_featured: editingSkill.is_featured
                })}
              >
                Update
              </Button>
              <Button variant="outline" onClick={() => setEditingSkill(null)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManageUnifiedSkills;