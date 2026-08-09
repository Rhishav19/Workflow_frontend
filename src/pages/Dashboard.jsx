import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsSection from "../components/dashboard/StatsSection";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <StatsSection />
    </div>
  );
};

export default Dashboard;
