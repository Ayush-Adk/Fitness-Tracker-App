
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function ActiveCompetitions() {
  const { user } = useAuth();

  const { data: activeCompetitions } = useQuery({
    queryKey: ['active-competitions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competitions')
        .select(`
          *,
          participants:competition_participants(*)
        `)
        .eq('status', 'active')
        .order('end_date', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Competitions</span>
          <Button variant="outline" size="sm">Join Competition</Button>
        </CardTitle>
        <CardDescription>Compete with others and track your progress</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activeCompetitions?.map((competition) => (
              <Card key={competition.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{competition.title}</h4>
                      <p className="text-sm text-muted-foreground">{competition.description}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {competition.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Ends: {format(new Date(competition.end_date), 'MMM d, yyyy')}
                    </span>
                    <span>
                      {competition.participants?.length || 0} participants
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            {(activeCompetitions?.length || 0) === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active competitions at the moment
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

