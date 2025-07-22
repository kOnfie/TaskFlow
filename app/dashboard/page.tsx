import { Header } from "@/components/dashboard/header";
import { StatsCards } from "@/components/dashboard/stats-cards/stats-cards";

import { ScrollArea } from "@/components/ui/scroll-area";

import RecentTasks from "@/components/dashboard/recent-tasks/recent-tasks";
import Sidebar from "@/components/dashboard/sidebar/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Dashboard" />

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <StatsCards  />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RecentTasks />

            <Sidebar />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
