import { useState } from "react";
import { Toaster } from "sonner";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DashboardPage } from "@/components/pages/dashboard";
import { ProjectsPage } from "@/components/pages/projects";
import { SettingsPage } from "@/components/pages/settings";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthDialog } from "@/components/dialogs/auth-dialog";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user } = useSupabase();

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
            {!user ? (
              <Button onClick={() => setAuthDialogOpen(true)}>
                <UserCircle className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            ) : null}
          </div>
          {renderPage()}
        </div>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SupabaseProvider>
        <AppContent />
        <Toaster />
      </SupabaseProvider>
    </ThemeProvider>
  );
}