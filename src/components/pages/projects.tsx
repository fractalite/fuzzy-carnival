import { ProjectCard } from "@/components/widgets/project-card";
import { ProjectTimeline } from "@/components/widgets/project-timeline";
import { TeamMembers } from "@/components/widgets/team-members";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectDialog } from "@/components/dialogs/project-dialog";
import { useState } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { toast } from "sonner";
import { Database } from "@/lib/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export function ProjectsPage() {
  const { projects, loading, error, createProject, updateProject } = useProjects();
  const { user } = useSupabase();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error Loading Projects</h2>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 p-6 border rounded-lg">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {[1, 2].map((j) => (
                    <Skeleton key={j} className="h-8 w-8 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleCreateProject = async (values: any) => {
    if (!user) {
      toast.error("You must be logged in to create a project");
      return;
    }

    try {
      await createProject({
        ...values,
        owner_id: user.id,
      });
      toast.success("Project created successfully");
    } catch (error) {
      toast.error("Failed to create project");
      throw error;
    }
  };

  const handleUpdateProject = async (values: any) => {
    if (!selectedProject) return;

    try {
      await updateProject(selectedProject.id, values);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      throw error;
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setSelectedProject(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} onClick={() => handleEditProject(project)} className="cursor-pointer">
            <ProjectCard
              project={project}
              teamMembers={[]}
              taskProgress={0}
            />
          </div>
        ))}
      </div>
      
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProjectTimeline />
        </div>
        <div>
          <TeamMembers />
        </div>
      </div>

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={selectedProject}
        onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
      />
    </div>
  );
}