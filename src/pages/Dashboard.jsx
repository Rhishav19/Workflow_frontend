import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsSection from "../components/dashboard/StatsSection";
import RecentActivity from "../components/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <StatsSection />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">
      </div>
    </div>
  );
};

export default Dashboard;