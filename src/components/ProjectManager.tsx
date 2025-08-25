import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Save, FolderOpen, Copy, Trash2, FileText, Clock, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export interface ProjectData {
  id: string;
  name: string;
  pages: any[];
  characters: any[];
  images: any[];
  settings: {
    gutter: number;
    pageSize: string;
    orientation: 'portrait' | 'landscape';
  };
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

interface ProjectManagerProps {
  currentProject: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
  onLoadProject: (project: ProjectData) => void;
  onSaveProject?: (project: ProjectData) => void;
}

const STORAGE_KEY = 'graphic-novel-projects';

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  currentProject,
  onLoadProject,
  onSaveProject
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
        setProjects(parsed);
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
  }, []);

  // Save projects to localStorage
  const saveProjectsToStorage = (projectsToSave: ProjectData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsToSave));
      setProjects(projectsToSave);
    } catch (error) {
      console.error('Failed to save projects:', error);
      toast.error('Failed to save projects to local storage');
    }
  };

  const generateProjectId = () => {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSaveProject = (saveAs: boolean = false) => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const existingProject = projects.find(p => p.name === projectName);
    
    if (existingProject && !saveAs) {
      // Update existing project
      const updatedProject: ProjectData = {
        ...existingProject,
        ...currentProject,
        name: projectName,
        updatedAt: new Date(),
        version: existingProject.version + 1
      };

      const updatedProjects = projects.map(p => 
        p.id === existingProject.id ? updatedProject : p
      );

      saveProjectsToStorage(updatedProjects);
      onSaveProject?.(updatedProject);
      toast.success('Project updated successfully!');
    } else {
      // Create new project
      const newProject: ProjectData = {
        id: generateProjectId(),
        ...currentProject,
        name: projectName,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      const updatedProjects = [...projects, newProject];
      saveProjectsToStorage(updatedProjects);
      onSaveProject?.(newProject);
      toast.success('Project saved successfully!');
    }

    setSaveDialogOpen(false);
    setProjectName('');
  };

  const handleLoadProject = (project: ProjectData) => {
    onLoadProject(project);
    setLoadDialogOpen(false);
    toast.success(`Loaded project: ${project.name}`);
  };

  const handleDuplicateProject = (project: ProjectData) => {
    const duplicatedProject: ProjectData = {
      ...project,
      id: generateProjectId(),
      name: `${project.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    };

    const updatedProjects = [...projects, duplicatedProject];
    saveProjectsToStorage(updatedProjects);
    toast.success('Project duplicated successfully!');
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjectsToStorage(updatedProjects);
    toast.success('Project deleted successfully!');
  };

  const handleExportProject = (project: ProjectData) => {
    try {
      const dataStr = JSON.stringify(project, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Project exported successfully!');
    } catch (error) {
      toast.error('Failed to export project');
    }
  };

  const handleImportProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target?.result as string);
        const importedProject: ProjectData = {
          ...projectData,
          id: generateProjectId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1
        };

        const updatedProjects = [...projects, importedProject];
        saveProjectsToStorage(updatedProjects);
        toast.success('Project imported successfully!');
      } catch (error) {
        toast.error('Failed to import project - invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex gap-2">
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gradient-card border-border">
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="bg-background border-border"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleSaveProject(false)}>
                Save Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Load
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl bg-gradient-card border-border">
          <DialogHeader>
            <DialogTitle>Load Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {projects.length} saved project{projects.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-input')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
                <input
                  id="import-input"
                  type="file"
                  accept=".json"
                  onChange={handleImportProject}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <ScrollArea className="h-96">
              {projects.length > 0 ? (
                <div className="grid gap-3">
                  {projects
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                    .map((project) => (
                      <Card 
                        key={project.id} 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-elegant ${
                          selectedProject === project.id 
                            ? 'ring-2 ring-primary shadow-glow bg-primary/5' 
                            : 'bg-gradient-card border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                            <div className="flex gap-1">
                              <Badge variant="secondary" className="text-xs">
                                v{project.version}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.pages.length} pages
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Updated: {formatDate(project.updatedAt)}</span>
                            </div>
                            <span>Created: {formatDate(project.createdAt)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>{project.characters.length} characters</span>
                              <span>{project.images.length} images</span>
                              <span>{project.settings.pageSize}</span>
                            </div>
                            
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLoadProject(project);
                                }}
                                className="h-8 px-2"
                              >
                                <FolderOpen className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateProject(project);
                                }}
                                className="h-8 px-2"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExportProject(project);
                                }}
                                className="h-8 px-2"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-8 px-2 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{project.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Saved Projects</h3>
                  <p className="text-muted-foreground">Save your first project to see it here</p>
                </div>
              )}
            </ScrollArea>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
                Cancel
              </Button>
              {selectedProject && (
                <Button
                  onClick={() => {
                    const project = projects.find(p => p.id === selectedProject);
                    if (project) handleLoadProject(project);
                  }}
                >
                  Load Selected
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};