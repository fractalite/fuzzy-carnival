import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/lib/types";
import { format } from "date-fns";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectCardProps {
  project: Project;
  teamMembers?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  }[];
  taskProgress?: number;
}

export function ProjectCard({ project, teamMembers = [], taskProgress = 0 }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600";
      case "completed":
        return "bg-blue-500/20 text-blue-600";
      case "on_hold":
        return "bg-yellow-500/20 text-yellow-600";
      default:
        return "bg-gray-500/20 text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{project.name}</CardTitle>
          <Badge 
            className={`mt-2 ${getStatusColor(project.status)}`}
            variant="secondary"
          >
            {project.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}
        <Progress value={taskProgress} className="h-2" />
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {teamMembers.map((member) => (
              <Avatar key={member.id} className="border-2 border-background w-8 h-8">
                <AvatarImage src={member.avatar_url || undefined} />
                <AvatarFallback>
                  {member.full_name
                    ? member.full_name.split(" ").map((n) => n[0]).join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex flex-col text-right">
            {project.start_date && (
              <span className="text-xs text-muted-foreground">
                Started {format(new Date(project.start_date), "MMM d, yyyy")}
              </span>
            )}
            {project.end_date && (
              <span className="text-xs text-muted-foreground">
                Due {format(new Date(project.end_date), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}