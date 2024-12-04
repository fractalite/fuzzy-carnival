import { useState } from "react";
import { Toaster, toast } from "sonner";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DashboardPage } from "@/components/pages/dashboard";
import { ProjectsPage } from "@/components/pages/projects";
import { SettingsPage } from "@/components/pages/settings";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthDialog } from "@/components/dialogs/auth-dialog";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { UserCircle, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, supabase } = useSupabase();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "projects":
        return <ProjectsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {!user ? (
                <Button onClick={() => setAuthDialogOpen(true)}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Account</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await supabase.auth.signOut();
                        toast.success("Signed out successfully");
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          {renderPage()}
        </div>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <AppContent />
        <Toaster />
      </SupabaseProvider>
    </ThemeProvider>
  );
}