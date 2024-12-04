import { ProjectCard } from "@/components/widgets/project-card";
import { ProjectTimeline } from "@/components/widgets/project-timeline";
import { TeamMembers } from "@/components/widgets/team-members";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsPage() {
  const { projects, loading, error } = useProjects();

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

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            // We'll implement these features later
            teamMembers={[]}
            taskProgress={0}
          />
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
    </div>
  );
}