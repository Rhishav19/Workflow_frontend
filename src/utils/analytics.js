const STATUS_ORDER = ["To Do", "In Progress", "Review", "Done"];
const UNASSIGNED = "Unassigned";
const HEALTHY_DAY_HOURS = 8;
const HEALTHY_WEEK_HOURS = 40;

export function getRangeStart(timeRange, now = new Date()) {
  const daysByRange = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  const days = daysByRange[timeRange];
  if (!days) return null;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days + 1);
  return start;
}

export function isWithinRange(dateValue, timeRange, now = new Date()) {
  if (timeRange === "all") return true;
  if (!dateValue) return false;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const start = getRangeStart(timeRange, now);
  return !start || date >= start;
}

export function hoursFromSeconds(seconds) {
  return Number(((seconds ?? 0) / 3600).toFixed(1));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function getHealthyHourThreshold(timeRange) {
  const daysByRange = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  const days = daysByRange[timeRange];
  if (!days) return HEALTHY_WEEK_HOURS;

  return Math.round((days / 7) * HEALTHY_WEEK_HOURS);
}

export function getDepartmentOptions({ projects, members, spending, workspaceId }) {
  const departments = new Set();

  projects
    .filter((project) => project.workspaceId === workspaceId)
    .forEach((project) => departments.add(normalizeDepartment(project.department)));

  members
    .filter((member) => member.workspaceId === workspaceId)
    .forEach((member) => departments.add(normalizeDepartment(member.department)));

  spending
    .filter((entry) => entry.workspaceId === workspaceId)
    .forEach((entry) => departments.add(normalizeDepartment(entry.department)));

  return ["All", ...Array.from(departments).sort((a, b) => a.localeCompare(b))];
}

export function buildAnalyticsModel({
  tasks,
  projects,
  members,
  entries,
  spending,
  workspaceId,
  department = "All",
  timeRange = "30d",
  workloadTaskThreshold = 5,
  now = new Date(),
}) {
  const workspaceProjects = projects.filter((project) => project.workspaceId === workspaceId);
  const workspaceMembers = members.filter((member) => member.workspaceId === workspaceId);
  const workspaceTasks = tasks.filter((task) => task.workspaceId === workspaceId);
  const workspaceEntries = entries.filter((entry) => entry.workspaceId === workspaceId);
  const workspaceSpending = spending.filter((entry) => entry.workspaceId === workspaceId);

  const projectById = new Map(workspaceProjects.map((project) => [project.id, project]));
  const memberByKey = buildMemberLookup(workspaceMembers);

  const scopedTasks = workspaceTasks
    .map((task) => ({
      ...task,
      analyticsDepartment: taskDepartment(task, projectById, memberByKey),
    }))
    .filter((task) => matchesDepartment(task.analyticsDepartment, department))
    .filter((task) => isWithinRange(task.createdAt, timeRange, now));

  const scopedEntries = workspaceEntries
    .map((entry) => ({
      ...entry,
      analyticsDepartment: entryDepartment(entry, projectById, memberByKey),
    }))
    .filter((entry) => matchesDepartment(entry.analyticsDepartment, department))
    .filter((entry) => isWithinRange(entry.startTime, timeRange, now));

  const scopedProjects = workspaceProjects.filter((project) =>
    matchesDepartment(normalizeDepartment(project.department), department)
  );

  const scopedSpending = workspaceSpending
    .map((entry) => ({
      ...entry,
      analyticsDepartment: normalizeDepartment(
        entry.department ?? projectById.get(entry.projectId)?.department
      ),
    }))
    .filter((entry) => matchesDepartment(entry.analyticsDepartment, department))
    .filter((entry) => isWithinRange(entry.spentAt ?? entry.createdAt, timeRange, now));

  return {
    completion: buildCompletion(scopedTasks),
    memberOverload: buildMemberOverload({
      tasks: scopedTasks,
      entries: scopedEntries,
      members: workspaceMembers,
      workloadTaskThreshold,
      timeRange,
      memberByKey,
    }),
    progressOvertime: buildProgressOvertime({
      projects: scopedProjects,
      entries: scopedEntries,
    }),
    departmentActivity: buildDepartmentActivity({
      tasks: workspaceTasks,
      entries: workspaceEntries,
      projects: workspaceProjects,
      members: workspaceMembers,
      department,
      timeRange,
      now,
      projectById,
      memberByKey,
    }),
    spendingBreakdown: buildSpendingBreakdown(scopedSpending),
  };
}

function buildCompletion(tasks) {
  const completed = tasks.filter((task) => task.status === "Done").length;
  const total = tasks.length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending: total - completed,
    rate,
    statusData: STATUS_ORDER.map((status) => ({
      name: status,
      value: tasks.filter((task) => task.status === status).length,
    })),
  };
}

function buildMemberOverload({
  tasks,
  entries,
  members,
  workloadTaskThreshold,
  timeRange,
  memberByKey,
}) {
  const healthyHours = getHealthyHourThreshold(timeRange);
  const byMember = new Map();

  members.forEach((member) => {
    byMember.set(member.id, {
      id: member.id,
      name: member.name,
      initials: member.initials,
      email: member.email,
      department: normalizeDepartment(member.department),
      openTasks: 0,
      loggedSeconds: 0,
    });
  });

  const unassigned = {
    id: UNASSIGNED,
    name: UNASSIGNED,
    initials: "--",
    email: "",
    department: UNASSIGNED,
    openTasks: 0,
    loggedSeconds: 0,
  };

  tasks
    .filter((task) => task.status !== "Done")
    .forEach((task) => {
      const member = memberByKey.get(normalizeLookup(task.assignee));
      const bucket = member ? byMember.get(member.id) : unassigned;
      bucket.openTasks += 1;
    });

  entries
    .filter((entry) => entry.durationSeconds != null)
    .forEach((entry) => {
      const member =
        memberByKey.get(normalizeLookup(entry.userEmail)) ??
        memberByKey.get(normalizeLookup(entry.userName));
      const bucket = member ? byMember.get(member.id) : unassigned;
      bucket.loggedSeconds += entry.durationSeconds;
    });

  if (unassigned.openTasks > 0 || unassigned.loggedSeconds > 0) {
    byMember.set(unassigned.id, unassigned);
  }

  const membersData = Array.from(byMember.values())
    .map((member) => {
      const loggedHours = hoursFromSeconds(member.loggedSeconds);
      const overloaded =
        member.openTasks > workloadTaskThreshold || loggedHours > healthyHours;
      return {
        ...member,
        loggedHours,
        healthyHours,
        overloaded,
        loadScore: member.openTasks + loggedHours / Math.max(healthyHours, 1),
      };
    })
    .filter((member) => member.openTasks > 0 || member.loggedHours > 0)
    .sort((a, b) => b.loadScore - a.loadScore);

  return {
    members: membersData,
    overloadedCount: membersData.filter((member) => member.overloaded).length,
    taskThreshold: workloadTaskThreshold,
    healthyHours,
  };
}

function buildProgressOvertime({ projects, entries }) {
  const projectIds = new Set(projects.map((project) => project.id));
  const overtimeSecondsByProject = allocateOvertimeByProject(entries, projectIds);

  return projects
    .map((project) => ({
      name: project.name,
      progress: Number(project.progress ?? 0),
      overtimeHours: hoursFromSeconds(overtimeSecondsByProject.get(project.id) ?? 0),
    }))
    .sort((a, b) => b.overtimeHours - a.overtimeHours || b.progress - a.progress)
    .slice(0, 8);
}

function buildDepartmentActivity({
  tasks,
  entries,
  projects,
  members,
  department,
  timeRange,
  now,
  projectById,
  memberByKey,
}) {
  const departmentMap = new Map();

  projects.forEach((project) => {
    const name = normalizeDepartment(project.department);
    getDepartmentBucket(departmentMap, name).projects += 1;
  });

  tasks
    .map((task) => ({
      ...task,
      analyticsDepartment: taskDepartment(task, projectById, memberByKey),
    }))
    .filter((task) => matchesDepartment(task.analyticsDepartment, department))
    .filter((task) => isWithinRange(task.createdAt, timeRange, now))
    .forEach((task) => {
      const bucket = getDepartmentBucket(departmentMap, task.analyticsDepartment);
      bucket.tasksCreated += 1;
      if (task.status === "Done") bucket.tasksCompleted += 1;
    });

  entries
    .map((entry) => ({
      ...entry,
      analyticsDepartment: entryDepartment(entry, projectById, memberByKey),
    }))
    .filter((entry) => matchesDepartment(entry.analyticsDepartment, department))
    .filter((entry) => isWithinRange(entry.startTime, timeRange, now))
    .filter((entry) => entry.durationSeconds != null)
    .forEach((entry) => {
      const bucket = getDepartmentBucket(departmentMap, entry.analyticsDepartment);
      bucket.loggedSeconds += entry.durationSeconds;
    });

  members
    .filter((member) => matchesDepartment(normalizeDepartment(member.department), department))
    .forEach((member) => {
      getDepartmentBucket(departmentMap, normalizeDepartment(member.department)).members += 1;
    });

  return Array.from(departmentMap.values())
    .map((bucket) => ({
      ...bucket,
      loggedHours: hoursFromSeconds(bucket.loggedSeconds),
    }))
    .filter(
      (bucket) =>
        matchesDepartment(bucket.name, department) &&
        (bucket.tasksCreated > 0 ||
          bucket.tasksCompleted > 0 ||
          bucket.loggedHours > 0 ||
          bucket.members > 0 ||
          bucket.projects > 0)
    )
    .sort((a, b) => b.loggedHours - a.loggedHours || b.tasksCreated - a.tasksCreated);
}

function buildSpendingBreakdown(spending) {
  const total = spending.reduce((sum, entry) => sum + Number(entry.amount ?? 0), 0);
  return {
    total,
    byCategory: aggregateMoney(spending, "category"),
    byDepartment: aggregateMoney(spending, "analyticsDepartment"),
  };
}

function allocateOvertimeByProject(entries, projectIds) {
  const dayGroups = new Map();
  const overtimeByProject = new Map();

  entries
    .filter((entry) => entry.durationSeconds != null && projectIds.has(entry.projectId))
    .forEach((entry) => {
      const day = new Date(entry.startTime).toISOString().slice(0, 10);
      const key = `${entry.userEmail ?? entry.userName ?? UNASSIGNED}|${day}`;
      const group = dayGroups.get(key) ?? { totalSeconds: 0, projectSeconds: new Map() };
      group.totalSeconds += entry.durationSeconds;
      group.projectSeconds.set(
        entry.projectId,
        (group.projectSeconds.get(entry.projectId) ?? 0) + entry.durationSeconds
      );
      dayGroups.set(key, group);
    });

  dayGroups.forEach((group) => {
    const overtimeSeconds = Math.max(
      0,
      group.totalSeconds - HEALTHY_DAY_HOURS * 3600
    );
    if (overtimeSeconds === 0 || group.totalSeconds === 0) return;

    group.projectSeconds.forEach((seconds, projectId) => {
      const share = seconds / group.totalSeconds;
      overtimeByProject.set(
        projectId,
        (overtimeByProject.get(projectId) ?? 0) + overtimeSeconds * share
      );
    });
  });

  return overtimeByProject;
}

function aggregateMoney(entries, field) {
  const byKey = new Map();

  entries.forEach((entry) => {
    const key = normalizeDepartment(entry[field]);
    byKey.set(key, (byKey.get(key) ?? 0) + Number(entry.amount ?? 0));
  });

  return Array.from(byKey.entries())
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);
}

function getDepartmentBucket(map, name) {
  const key = normalizeDepartment(name);
  if (!map.has(key)) {
    map.set(key, {
      name: key,
      tasksCreated: 0,
      tasksCompleted: 0,
      loggedSeconds: 0,
      members: 0,
      projects: 0,
    });
  }
  return map.get(key);
}

function buildMemberLookup(members) {
  const lookup = new Map();
  members.forEach((member) => {
    [member.id, member.name, member.email, member.initials]
      .filter(Boolean)
      .forEach((key) => lookup.set(normalizeLookup(key), member));
  });
  return lookup;
}

function taskDepartment(task, projectById, memberByKey) {
  const projectDepartment = projectById.get(task.projectId)?.department;
  if (projectDepartment) return normalizeDepartment(projectDepartment);

  const member = memberByKey.get(normalizeLookup(task.assignee));
  return normalizeDepartment(member?.department);
}

function entryDepartment(entry, projectById, memberByKey) {
  const projectDepartment = projectById.get(entry.projectId)?.department;
  if (projectDepartment) return normalizeDepartment(projectDepartment);

  const member =
    memberByKey.get(normalizeLookup(entry.userEmail)) ??
    memberByKey.get(normalizeLookup(entry.userName));
  return normalizeDepartment(member?.department);
}

function matchesDepartment(value, department) {
  return department === "All" || normalizeDepartment(value) === department;
}

function normalizeDepartment(value) {
  return value?.trim() || UNASSIGNED;
}

function normalizeLookup(value) {
  return String(value ?? "").trim().toLowerCase();
}
