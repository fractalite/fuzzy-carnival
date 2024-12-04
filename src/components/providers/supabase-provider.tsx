import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type SupabaseContextType = {
  user: User | null;
  profile: Profile | null;
  supabase: typeof supabase;
  loading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  profile: null,
  supabase,
  loading: true,
});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN") {
        // Create profile if it doesn't exist
        if (session?.user) {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select()
            .eq("id", session.user.id)
            .single();

          if (!existingProfile) {
            const { error } = await supabase.from("profiles").insert({
              id: session.user.id,
              full_name: null,
              avatar_url: null,
            });

            if (!error) {
              getProfile(session.user.id);
            }
          } else {
            setProfile(existingProfile);
          }
        }
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    profile,
    supabase,
    loading,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}
