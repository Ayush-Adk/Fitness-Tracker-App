import { Activity } from "@/types/fitness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { startOfWeek, addDays, format } from "date-fns";

interface WeeklyProgressProps {
  activities: Activity[];
}

export function WeeklyProgress({ activities }: WeeklyProgressProps) {
  // Get the start of the current week
  const weekStart = startOfWeek(new Date());
  
  // Create an array of the last 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      day: format(date, "EEE"),
      calories: 0,
    };
  });

  // Sum up calories for each day
  activities.forEach((activity) => {
    const activityDate = new Date(activity.date);
    const dayIndex = weekDays.findIndex(
      (day) => format(day.date, "yyyy-MM-dd") === format(activityDate, "yyyy-MM-dd")
    );
    if (dayIndex !== -1 && activity.calories) {
      weekDays[dayIndex].calories += activity.calories;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekDays}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="calories"
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2DD4BF" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}