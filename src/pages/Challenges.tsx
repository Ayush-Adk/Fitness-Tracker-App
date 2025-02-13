
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Competitions } from "@/components/challenges/Competitions";
import { Achievements } from "@/components/challenges/Achievements";

export default function Challenges() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Challenges & Achievements</h1>
          </div>
        </div>

        <Tabs defaultValue="competitions" className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="competitions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Competitions</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="competitions" className="space-y-4">
            <Competitions />
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-4">
            <Achievements />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
