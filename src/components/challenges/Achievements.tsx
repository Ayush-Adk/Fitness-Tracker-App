
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Star, Crown, Sun, Rocket, Dumbbell, Users } from "lucide-react";

export function Achievements() {
  const { user } = useAuth();

  const { data: achievements } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');

      if (achievementsError) throw achievementsError;

      const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user?.id);

      if (userAchievementsError) throw userAchievementsError;

      const earnedIds = new Set(userAchievements?.map(ua => ua.achievement_id));
      
      return allAchievements?.map(achievement => ({
        ...achievement,
        earned: earnedIds.has(achievement.id)
      }));
    },
    enabled: !!user,
  });

  const getIcon = (iconName: string) => {
    const props = { className: "h-8 w-8" };
    switch (iconName) {
      case 'trophy': return <Trophy {...props} />;
      case 'star': return <Star {...props} />;
      case 'crown': return <Crown {...props} />;
      case 'sun': return <Sun {...props} />;
      case 'rocket': return <Rocket {...props} />;
      case 'dumbbell': return <Dumbbell {...props} />;
      case 'users': return <Users {...props} />;
      default: return <Award {...props} />;
    }
  };

  const earnedCount = achievements?.filter(a => a.earned).length || 0;
  const totalCount = achievements?.length || 0;
  const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{earnedCount} earned</span>
              <span>{totalCount} total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>All Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="grid gap-4">
              {achievements?.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`p-6 transition-all duration-200 ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/10 dark:to-yellow-950/10' 
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      achievement.earned 
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {getIcon(achievement.icon)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <div className="text-sm font-medium">
                          {achievement.points} points
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {achievement.earned && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                          ✨ Achievement Unlocked!
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
