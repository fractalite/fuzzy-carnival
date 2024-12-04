import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/components/providers/supabase-provider";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  type: "meeting" | "deadline" | "reminder";
}

export function EventCalendar() {
  const { supabase, user } = useSupabase();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      if (!user) return;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("owner_id", user.id)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(5);

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }

    loadEvents();
  }, [supabase, user]);

  const getEventTypeIcon = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "🤝";
      case "deadline":
        return "⏰";
      case "reminder":
        return "📝";
      default:
        return "📅";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            Loading events...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-4 p-4 border rounded-lg"
            >
              <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    {format(new Date(event.start_time), "MMM d, yyyy h:mm a")}
                  </p>
                  {event.location && (
                    <p className="flex items-center gap-1">
                      📍 {event.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center text-muted-foreground">
              No upcoming events
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
