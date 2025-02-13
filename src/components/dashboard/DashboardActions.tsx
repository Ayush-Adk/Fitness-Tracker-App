
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, Target, LineChart, RefreshCw, Trophy, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardActions() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['competition-stats', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_competition_stats')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Button
        variant="outline"
        size="lg"
        className="h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all"
        onClick={() => navigate("/activities")}
      >
        <Activity className="h-8 w-8" />
        <span className="text-lg font-semibold">Activities</span>
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 transition-all"
        onClick={() => navigate("/goals")}
      >
        <Target className="h-8 w-8" />
        <span className="text-lg font-semibold">Goals</span>
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 transition-all"
        onClick={() => navigate("/tracker")}
      >
        <LineChart className="h-8 w-8" />
        <span className="text-lg font-semibold">Tracker</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 hover:from-orange-500/20 hover:to-orange-500/10 transition-all"
        onClick={() => navigate("/challenges")}
      >
        <RefreshCw className="h-8 w-8" />
        <div className="text-center">
          <span className="text-lg font-semibold block">Challenges</span>
          <span className="text-sm text-muted-foreground">{stats?.competitions_joined || 0} Active</span>
        </div>
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 transition-all"
        onClick={() => navigate("/competitions")}
      >
        <Trophy className="h-8 w-8" />
        <div className="text-center">
          <span className="text-lg font-semibold block">Competitions</span>
          <span className="text-sm text-muted-foreground">{stats?.competitions_completed || 0} Completed</span>
        </div>
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="h-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 transition-all"
        onClick={() => navigate("/achievements")}
      >
        <Award className="h-8 w-8" />
        <div className="text-center">
          <span className="text-lg font-semibold block">Achievements</span>
          <span className="text-sm text-muted-foreground">{stats?.achievements_earned || 0} Earned</span>
        </div>
      </Button>
    </div>
  );
}
