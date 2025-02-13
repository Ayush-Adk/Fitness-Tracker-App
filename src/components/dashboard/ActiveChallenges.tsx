
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlayCircle, CheckCircle, Plus, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ActiveChallenges() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: activeChallenges, refetch: refetchActive } = useQuery({
    queryKey: ['active-challenges', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenge:challenges(*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'in_progress');

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: availableChallenges } = useQuery({
    queryKey: ['available-challenges', user?.id],
    queryFn: async () => {
      const { data: allChallenges, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .gt('end_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (challengesError) throw challengesError;

      if (!activeChallenges || activeChallenges.length === 0) {
        return allChallenges;
      }

      // Filter out already joined challenges
      const activeIds = new Set(activeChallenges.map(c => c.challenge_id));
      return allChallenges?.filter(challenge => !activeIds.has(challenge.id)) || [];
    },
    enabled: !!user,
  });

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('user_challenges')
        .insert({
          challenge_id: challengeId,
          user_id: user?.id,
          status: 'in_progress',
          current_value: 0,
        });

      if (error) throw error;

      toast({
        title: "Challenge joined!",
        description: "Good luck with your new challenge!",
      });

      refetchActive();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error joining challenge",
        description: "Please try again later.",
      });
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('user_challenges')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: "Challenge completed!",
        description: "Congratulations on completing the challenge!",
      });

      refetchActive();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error completing challenge",
        description: "Please try again later.",
      });
    }
  };

  const handleUpdateProgress = async (challengeId: string, newValue: number) => {
    try {
      const { error } = await supabase
        .from('user_challenges')
        .update({ current_value: newValue })
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: "Progress updated!",
        description: "Keep up the good work!",
      });

      refetchActive();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating progress",
        description: "Please try again later.",
      });
    }
  };

  return (
    <Card className="relative dark:border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="dark:text-white">Active Challenges</CardTitle>
            <CardDescription className="dark:text-gray-400">Your ongoing fitness challenges</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 dark:border-gray-700 dark:hover:bg-gray-800">
                <Plus className="h-4 w-4" />
                Join Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Available Challenges</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Choose a challenge to join and start your fitness journey
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[300px] mt-4">
                <div className="space-y-4">
                  {availableChallenges?.map((challenge) => (
                    <div 
                      key={challenge.id}
                      className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:bg-muted/50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold dark:text-white">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">{challenge.description}</p>
                        <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
                          Target: {challenge.target_value} {challenge.type}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinChallenge(challenge.id)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Join
                      </Button>
                    </div>
                  ))}
                  {(!availableChallenges || availableChallenges.length === 0) && (
                    <div className="text-center text-muted-foreground dark:text-gray-400 py-8">
                      No available challenges at the moment.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activeChallenges?.map((userChallenge) => (
              <div 
                key={userChallenge.id} 
                className="flex flex-col p-4 rounded-lg border dark:border-gray-700 hover:bg-muted/50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold dark:text-white">{userChallenge.challenge.title}</h4>
                  {userChallenge.current_value >= userChallenge.challenge.target_value ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteChallenge(userChallenge.id)}
                      className="flex items-center gap-2 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateProgress(userChallenge.id, userChallenge.current_value + 1)}
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Update Progress
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                  {userChallenge.challenge.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm dark:text-gray-300">
                    <span>Progress: {userChallenge.current_value} / {userChallenge.challenge.target_value}</span>
                    <span>{Math.round((userChallenge.current_value / userChallenge.challenge.target_value) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(userChallenge.current_value / userChallenge.challenge.target_value) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
            {(!activeChallenges || activeChallenges.length === 0) && (
              <div className="text-center text-muted-foreground dark:text-gray-400 py-8">
                <PlayCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No active challenges.</p>
                <p className="text-sm">Join a challenge to get started!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
