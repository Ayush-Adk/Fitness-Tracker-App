
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Trophy, Users, Calendar, Award } from "lucide-react";
import { CompetitionWithProgress } from "./types";

type CompetitionCardProps = {
  competition: CompetitionWithProgress;
  onJoin: (id: string) => Promise<void>;
};

export function CompetitionCard({ competition, onJoin }: CompetitionCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{competition.title}</h3>
            <p className="text-muted-foreground">{competition.description}</p>
          </div>
          <Badge variant="secondary" className="capitalize">
            {competition.competition_type}
          </Badge>
        </div>

        {competition.progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {competition.progress.current_value} / {competition.target_value}
              </span>
            </div>
            <Progress 
              value={(competition.progress.current_value / competition.target_value) * 100} 
              className="h-2"
            />
          </div>
        )}

        {competition.milestones.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Milestones</h4>
            <div className="flex gap-2">
              {competition.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-2 rounded-full ${
                    milestone.completed
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  title={milestone.title}
                >
                  <Award className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Ends: {format(new Date(competition.end_date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{competition.participants?.length || 0} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>{competition.reward_points} points</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm">View Rules</Button>
          {!competition.progress ? (
            <Button 
              size="sm"
              onClick={() => onJoin(competition.id)}
            >
              Join Competition
            </Button>
          ) : (
            <Button size="sm">Update Progress</Button>
          )}
        </div>
      </div>
    </Card>
  );
}
