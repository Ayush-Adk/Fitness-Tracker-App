import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Goal } from "@/types/fitness";
import { GoalProgress } from "@/components/GoalProgress";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Goals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching goals:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch goals",
        });
        throw error;
      }

      return data as Goal[];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Your Goals</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-8">
        <div className="flex justify-end">
          <AddGoalDialog />
        </div>

        {goals && goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalProgress key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your progress by setting your first goal
            </p>
            <AddGoalDialog />
          </div>
        )}
      </main>
    </div>
  );
}