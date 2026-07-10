import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsSection from "../components/dashboard/StatsSection";
import RecentActivity from "../components/dashboard/RecentActivity";
import UpcomingMeetings from "../components/dashboard/UpcomingMeetings";
import ActiveProjects from "../components/dashboard/ActiveProjects";
import QuickActions from "../components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <StatsSection />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        <UpcomingMeetings />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <ActiveProjects />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;