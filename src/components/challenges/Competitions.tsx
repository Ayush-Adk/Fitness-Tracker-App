
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { StatsCards } from "./StatsCards";
import { CreateCompetitionForm } from "./CreateCompetitionForm";
import { CompetitionCard } from "./CompetitionCard";
import { CompetitionWithProgress } from "./types";

export function Competitions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: competitions, refetch } = useQuery({
    queryKey: ['competitions-with-progress', user?.id],
    queryFn: async () => {
      const { data: competitionsData, error: competitionsError } = await supabase
        .from('competitions')
        .select(`
          *,
          participants:competition_participants(*),
          milestones:competition_milestones(*)
        `)
        .eq('status', 'active')
        .order('end_date', { ascending: true });

      if (competitionsError) throw competitionsError;

      const { data: progressData, error: progressError } = await supabase
        .from('competition_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (progressError) throw progressError;

      const { data: completedMilestones, error: milestonesError } = await supabase
        .from('user_milestone_progress')
        .select('milestone_id, completed_at')
        .eq('user_id', user?.id);

      if (milestonesError) throw milestonesError;

      const completedMilestoneIds = new Set(completedMilestones?.map(m => m.milestone_id));

      return competitionsData?.map(competition => ({
        ...competition,
        progress: progressData?.find(p => p.competition_id === competition.id),
        milestones: competition.milestones.map(milestone => ({
          ...milestone,
          completed: completedMilestoneIds.has(milestone.id)
        }))
      })) as CompetitionWithProgress[];
    },
    enabled: !!user,
  });

  const handleJoinCompetition = async (competitionId: string) => {
    try {
      const { error: participantError } = await supabase
        .from('competition_participants')
        .insert({
          competition_id: competitionId,
          user_id: user?.id,
        });

      if (participantError) throw participantError;

      const { error: progressError } = await supabase
        .from('competition_progress')
        .insert({
          competition_id: competitionId,
          user_id: user?.id,
          current_value: 0,
        });

      if (progressError) throw progressError;

      toast({
        title: "Success!",
        description: "You've successfully joined the competition.",
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join competition. Please try again.",
      });
    }
  };

  const onSubmitNewCompetition = async (values: any) => {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .insert({
          title: values.title,
          description: values.description,
          competition_type: values.competition_type,
          target_value: parseInt(values.target_value),
          reward_points: parseInt(values.reward_points),
          rules: values.rules,
          team_size: parseInt(values.team_size),
          end_date: values.end_date,
          status: 'active',
          creator_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Competition created successfully.",
      });

      setDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create competition. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <StatsCards competitions={competitions} />

      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Competitions</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create Competition</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Competition</DialogTitle>
                </DialogHeader>
                <CreateCompetitionForm onSubmit={onSubmitNewCompetition} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="grid gap-4">
              {competitions?.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  onJoin={handleJoinCompetition}
                />
              ))}
              {(competitions?.length || 0) === 0 && (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Active Competitions</h3>
                  <p className="text-muted-foreground">Create a competition to get started!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
