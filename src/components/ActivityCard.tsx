import { Activity } from "@/types/fitness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Timer, Flame } from "lucide-react";
import { format } from "date-fns";
import { ShareActivityDialog } from "./ShareActivityDialog";
import { ActivityComments } from "./ActivityComments";
import { useState } from "react";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <ShareActivityDialog activity={activity} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(new Date(activity.date), "MMM d, yyyy")}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activity.description && (
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          )}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-fitness-primary" />
              <span className="text-sm font-medium">{activity.duration}min</span>
            </div>
            {activity.calories && (
              <div className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-fitness-secondary" />
                <span className="text-sm font-medium">{activity.calories} cal</span>
              </div>
            )}
            {activity.distance && (
              <div className="text-sm font-medium">
                {activity.distance}km
              </div>
            )}
          </div>
          {showComments && (
            <div className="mt-4">
              <ActivityComments activity={activity} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}