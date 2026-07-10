import StatCard from "./StatCard";

const StatsSection = () => {
  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <StatCard
        title="Projects"
        value="12"
        color="text-blue-600"
      />

      <StatCard
        title="Tasks"
        value="45"
        color="text-green-600"
      />

      <StatCard
        title="Budget"
        value="$52K"
        color="text-purple-600"
      />

      <StatCard
        title="Team Members"
        value="8"
        color="text-orange-500"
      />

    </div>

  );
};

export default StatsSection;    