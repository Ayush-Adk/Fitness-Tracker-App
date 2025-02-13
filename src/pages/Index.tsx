
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ActiveChallenges } from "@/components/dashboard/ActiveChallenges";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { ActiveCompetitions } from "@/components/dashboard/ActiveCompetitions";
import { RecentAchievements } from "@/components/dashboard/RecentAchievements";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileCard />
          <div className="lg:col-span-2 space-y-6">
            <ActiveChallenges />
            <DashboardActions />
            <ActiveCompetitions />
            <RecentAchievements />
          </div>
        </div>
      </main>
    </div>
  );
}
