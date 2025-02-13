import { Goal } from "@/types/fitness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GoalProgressProps {
  goal: Goal;
}

export function GoalProgress({ goal }: GoalProgressProps) {
  const progress = (goal.current / goal.target) * 100;
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {goal.current}/{goal.target} {goal.unit}
        </span>
      </CardHeader>
      <CardContent>
        <Progress 
          value={progress} 
          className="h-2"
          style={{ "--progress-width": `${progress}%` } as React.CSSProperties}
        />
      </CardContent>
    </Card>
  );
}