import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/types/fitness";
import { Flame, Timer, Route } from "lucide-react";

interface QuickStatsProps {
  activities: Activity[];
}

export function QuickStats({ activities }: QuickStatsProps) {
  const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
  const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalDistance = activities
    .reduce((sum, activity) => sum + (activity.distance || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-fitness-primary to-fitness-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Calories Burned</CardTitle>
          <Flame className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalCalories}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-fitness-secondary to-fitness-accent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Active Minutes</CardTitle>
          <Timer className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalMinutes}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-fitness-accent to-fitness-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Distance (km)</CardTitle>
          <Route className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalDistance.toFixed(1)}</div>
        </CardContent>
      </Card>
    </div>
  );
}