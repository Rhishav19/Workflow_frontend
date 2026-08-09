import { useEffect, useMemo } from "react";
import { useProjects } from "../../../context/ProjectsContext";
import { useTasks } from "../../../context/TasksContext";
import { useMembers } from "../../../context/MembersContext";
import { useTimeTracking } from "../../../context/TimeTrackingContext";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { useAnalyticsStore } from "../../../stores/analyticsStore";
import {
  buildAnalyticsModel,
  getDepartmentOptions,
} from "../../../utils/analytics";
import AnalyticsFilters from "./AnalyticsFilters";
import TaskCompletionRate from "./TaskCompletionRate";
import MemberOverload from "./MemberOverload";
import ProgressOvertimeChart from "./ProgressOvertimeChart";
import DepartmentActivity from "./DepartmentActivity";
import SpendingBreakdown from "./SpendingBreakdown";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";

export default function AnalyticsSection() {
  const { workspaceId } = useWorkspace();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { members, loading: membersLoading, error: membersError } = useMembers();
  const { entries, loading: entriesLoading, error: entriesError } = useTimeTracking();

  const department = useAnalyticsStore((state) => state.department);
  const timeRange = useAnalyticsStore((state) => state.timeRange);
  const workloadTaskThreshold = useAnalyticsStore(
    (state) => state.workloadTaskThreshold
  );
  const spending = useAnalyticsStore((state) => state.spending);
  const spendingLoading = useAnalyticsStore((state) => state.spendingLoading);
  const spendingError = useAnalyticsStore((state) => state.spendingError);
  const fetchSpending = useAnalyticsStore((state) => state.fetchSpending);
  const setDepartment = useAnalyticsStore((state) => state.setDepartment);
  const setTimeRange = useAnalyticsStore((state) => state.setTimeRange);
  const setWorkloadTaskThreshold = useAnalyticsStore(
    (state) => state.setWorkloadTaskThreshold
  );

  useEffect(() => {
    fetchSpending(workspaceId);
  }, [fetchSpending, workspaceId]);

  const departments = useMemo(
    () => getDepartmentOptions({ projects, members, spending, workspaceId }),
    [projects, members, spending, workspaceId]
  );

  useEffect(() => {
    if (!departments.includes(department)) setDepartment("All");
  }, [department, departments, setDepartment]);

  const model = useMemo(
    () =>
      buildAnalyticsModel({
        tasks,
        projects,
        members,
        entries,
        spending,
        workspaceId,
        department,
        timeRange,
        workloadTaskThreshold,
      }),
    [
      tasks,
      projects,
      members,
      entries,
      spending,
      workspaceId,
      department,
      timeRange,
      workloadTaskThreshold,
    ]
  );

  const coreLoading = projectsLoading || tasksLoading || membersLoading || entriesLoading;
  const coreError = [projectsError, tasksError, membersError, entriesError]
    .filter(Boolean)
    .join(" ");

  if (!workspaceId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Select a workspace to view dashboard analytics.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-bold text-gray-900">Analytics</h2>
          <p className="mt-1 text-[15px] text-gray-500">
            Operational health across tasks, people, time, departments, and spend.
          </p>
        </div>
        <AnalyticsFilters
          departments={departments}
          department={department}
          timeRange={timeRange}
          onDepartmentChange={setDepartment}
          onTimeRangeChange={setTimeRange}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TaskCompletionRate
          data={model.completion}
          loading={coreLoading}
          error={coreError}
        />
        <MemberOverload
          data={model.memberOverload}
          loading={coreLoading}
          error={coreError}
          threshold={workloadTaskThreshold}
          onThresholdChange={setWorkloadTaskThreshold}
        />
      </div>

      <ProgressOvertimeChart
        data={model.progressOvertime}
        loading={coreLoading}
        error={coreError}
      />

      <DepartmentActivity
        data={model.departmentActivity}
        loading={coreLoading}
        error={coreError}
      />

      <SpendingBreakdown
        data={model.spendingBreakdown}
        loading={spendingLoading}
        error={spendingError}
      />
    </section>
  );
}
