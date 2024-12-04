import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { toast } from "sonner";

interface SidebarProps {
  className?: string;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ className, currentPage, onNavigate }: SidebarProps) {
  const { user, supabase } = useSupabase();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <div className={cn("pb-12 w-64 border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Workspace</h2>
          <div className="space-y-1">
            <Button
              variant={currentPage === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigate("dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={currentPage === "projects" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigate("projects")}
            >
              <ListTodo className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Settings</h2>
          <div className="space-y-1">
            <Button
              variant={currentPage === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigate("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      {user && (
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <div className="space-y-2">
            <div className="px-4 py-2 flex items-center">
              <UserCircle className="h-6 w-6 mr-2" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
