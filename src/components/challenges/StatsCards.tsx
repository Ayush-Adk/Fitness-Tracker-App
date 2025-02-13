
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Award } from "lucide-react";
import { CompetitionWithProgress } from "./types";

type StatsCardsProps = {
  competitions: CompetitionWithProgress[] | undefined;
};

export function StatsCards({ competitions }: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Active Competitions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{competitions?.length || 0}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Total Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {competitions?.reduce((acc, curr) => acc + (curr.participants?.length || 0), 0)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {competitions?.reduce((acc, curr) => {
              const completedMilestones = curr.milestones.filter(m => m.completed);
              return acc + completedMilestones.reduce((sum, m) => sum + m.reward_points, 0);
            }, 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
