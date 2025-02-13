
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Trophy, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function RecentAchievements() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: achievements, isError } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading achievements",
          description: "Please try again later.",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  const getAchievementIcon = (icon: string) => {
    const iconProps = {
      className: cn(
        "h-12 w-12",
        icon === 'trophy' && "text-yellow-500",
        icon === 'star' && "text-purple-500",
        icon === 'award' && "text-blue-500"
      )
    };

    switch (icon) {
      case 'trophy':
        return <Trophy {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  if (isError) return null;

  return (
    <Card className="dark:border-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Recent Achievements</CardTitle>
        <CardDescription className="dark:text-gray-400">Your latest fitness milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="grid gap-4">
            {achievements?.map((userAchievement) => (
              <div 
                key={userAchievement.id} 
                className="flex items-center gap-4 p-4 rounded-lg border dark:border-gray-700 hover:bg-muted/50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getAchievementIcon(userAchievement.achievement.icon)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg dark:text-white">{userAchievement.achievement.title}</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {userAchievement.achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
                    Earned: {new Date(userAchievement.earned_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
            {(!achievements || achievements.length === 0) && (
              <div className="text-center text-muted-foreground dark:text-gray-400 py-12">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-500/50" />
                <p className="font-semibold">No achievements yet</p>
                <p className="text-sm">Complete challenges to earn achievements!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
