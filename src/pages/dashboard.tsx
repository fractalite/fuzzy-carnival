import { useSupabase } from "@/components/providers/supabase-provider";
import { StatsWidget } from "@/components/widgets/stats-widget";
import { TaskBoard } from "@/components/widgets/task-board";
import { ProjectList } from "@/components/widgets/project-list";
import { EventCalendar } from "@/components/widgets/event-calendar";

export default function Dashboard() {
  const { user } = useSupabase();

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsWidget />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Task Board */}
        <div className="md:col-span-2">
          <TaskBoard />
        </div>

        {/* Recent Projects */}
        <div>
          <ProjectList />
        </div>

        {/* Upcoming Events */}
        <div>
          <EventCalendar />
        </div>
      </div>
    </div>
  );
}
