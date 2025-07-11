import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, RefreshCw } from "lucide-react";
import axios from "axios";

const AddUnifiedSkill = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "technical_skill",
    category: "other",
    proficiency: 50,
    experience_years: 0,
    description: "",
    tags: [],
    is_featured: false
  });
  
  const [svg, setSvg] = useState("");
  const [svgPreview, setSvgPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");

  const skillTypes = [
    { value: "technical_skill", label: "Technical Skill" },
    { value: "software_application", label: "Software Application" },
    { value: "soft_skill", label: "Soft Skill" },
    { value: "framework", label: "Framework" },
    { value: "language", label: "Programming Language" },
    { value: "tool", label: "Tool" }
  ];

  const categories = [
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
    { value: "database", label: "Database" },
    { value: "devops", label: "DevOps" },
    { value: "testing", label: "Testing" },
    { value: "project_management", label: "Project Management" },
    { value: "communication", label: "Communication" },
    { value: "other", label: "Other" }
  ];

  const handleSvg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSvgPreview(reader.result);
        setSvg(file);
      };
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Name is required!");
      return;
    }
    
    if (!svg) {
      toast.error("Image/Icon is required!");
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      submitData.append("svg", svg);

      const response = await axios.post(
        "http://localhost:4000/api/v1/unified-skills/add",
        submitData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setFormData({
          name: "",
          type: "technical_skill",
          category: "other",
          proficiency: 50,
          experience_years: 0,
          description: "",
          tags: [],
          is_featured: false
        });
        setSvg("");
        setSvgPreview("");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error(error.response?.data?.message || "Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4 sm:pl-14">
      <form onSubmit={handleSubmit} className="w-[100%] px-5 md:w-[800px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Add New Skill</CardTitle>
            <p className="text-center text-muted-foreground">
              Add a technical skill, software application, or any other expertise
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., React.js, Photoshop, Python"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
            </div>

            {/* Category and Proficiency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                <Label htmlFor="proficiency">Proficiency (1-100)</Label>
                <Input
                  id="proficiency"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => handleInputChange("proficiency", parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Experience and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience_years">Experience (Years)</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => handleInputChange("experience_years", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2 md:col-span-1">
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange("is_featured", e.target.checked)}
                    className="mr-2"
                  />
                  Featured Skill
                </Label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your experience with this skill..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Icon/Image *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  {svgPreview ? (
                    <div className="space-y-4">
                      <img
                        src={svgPreview}
                        alt="Preview"
                        className="mx-auto h-16 w-16 object-contain"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSvgPreview("");
                          setSvg("");
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Choose File
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleSvg}
                          />
                        </label>
                        <p className="mt-2 text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Adding Skill...
                </>
              ) : (
                "Add Skill"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddUnifiedSkill;