import { chromium } from "@playwright/test";
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const baseUrl = "http://127.0.0.1:4174";
const supabaseRest = "https://vppmbfiwbfraoblifrwd.supabase.co/rest/v1";
const screenshotsDir = mkdtempSync(path.join(tmpdir(), "workflow-analytics-"));

const mockRows = {
  memberships: [
    {
      workspace_id: "ws-demo",
      role: "Admin",
      workspaces: {
        id: "ws-demo",
        name: "Demo Company",
        created_by: "alex.rivera@workflow.com",
      },
    },
  ],
  projects: [
    {
      id: "proj-1",
      workspace_id: "ws-demo",
      name: "Workflow Dashboard",
      description: "Analytics buildout",
      department: "Product",
      status: "On Track",
      progress: 72,
      due_date: "Aug 20, 2026",
      team: [],
      team_overflow: 0,
      created_at: "2026-08-01T09:00:00.000Z",
    },
    {
      id: "proj-2",
      workspace_id: "ws-demo",
      name: "Infrastructure Upgrade",
      description: "Platform capacity",
      department: "Engineering",
      status: "At Risk",
      progress: 48,
      due_date: "Aug 30, 2026",
      team: [],
      team_overflow: 1,
      created_at: "2026-08-02T09:00:00.000Z",
    },
    {
      id: "proj-3",
      workspace_id: "ws-demo",
      name: "Launch Campaign",
      description: "Growth experiments",
      department: "Growth",
      status: "Planning",
      progress: 28,
      due_date: "Sep 10, 2026",
      team: [],
      team_overflow: 0,
      created_at: "2026-08-03T09:00:00.000Z",
    },
  ],
  tasks: [
    task("task-1", "proj-1", "Dashboard chart QA", "Done", "AR", "2026-08-01T10:00:00.000Z"),
    task("task-2", "proj-1", "Completion metrics", "Done", "SC", "2026-08-02T10:00:00.000Z"),
    task("task-3", "proj-2", "Cache timing review", "In Progress", "DM", "2026-08-03T10:00:00.000Z"),
    task("task-4", "proj-2", "Database index audit", "Review", "DM", "2026-08-04T10:00:00.000Z"),
    task("task-5", "proj-2", "Incident follow-up", "To Do", "DM", "2026-08-05T10:00:00.000Z"),
    task("task-6", "proj-3", "Campaign brief", "To Do", "JK", "2026-08-06T10:00:00.000Z"),
  ],
  members: [
    member("mem-1", "Alex Rivera", "AR", "alex.rivera@workflow.com", "Product", "Manager"),
    member("mem-2", "Sarah Chen", "SC", "sarah.chen@workflow.com", "Product", "Manager"),
    member("mem-3", "David Miller", "DM", "david.miller@workflow.com", "Engineering", "Employee"),
    member("mem-4", "Jordan Kim", "JK", "jordan.kim@workflow.com", "Growth", "Employee"),
  ],
  time_entries: [
    entry("entry-1", "task-1", "proj-1", "alex.rivera@workflow.com", "Alex Rivera", "2026-08-04T08:00:00.000Z", 18000),
    entry("entry-2", "task-3", "proj-2", "alex.rivera@workflow.com", "Alex Rivera", "2026-08-04T13:00:00.000Z", 18000),
    entry("entry-3", "task-4", "proj-2", "david.miller@workflow.com", "David Miller", "2026-08-05T09:00:00.000Z", 14400),
    entry("entry-4", "task-6", "proj-3", "jordan.kim@workflow.com", "Jordan Kim", "2026-08-06T09:00:00.000Z", 7200),
  ],
  spending_entries: [
    spending("spend-1", "Product", "Software", 2400, "2026-08-01"),
    spending("spend-2", "Engineering", "Infrastructure", 3900, "2026-08-02"),
    spending("spend-3", "Growth", "Campaigns", 1800, "2026-08-03"),
    spending("spend-4", "Product", "Research", 950, "2026-08-04"),
  ],
};

const viewports = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "tablet", width: 900, height: 1100 },
  { name: "mobile", width: 390, height: 1200 },
];

const server =
  process.platform === "win32"
    ? spawn(process.env.ComSpec ?? "cmd.exe", [
        "/d",
        "/s",
        "/c",
        "npm run dev -- --host 127.0.0.1 --port 4174",
      ], { stdio: "pipe" })
    : spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4174"], {
        stdio: "pipe",
      });

try {
  await waitForServer();

  const browser = await chromium.launch();
  const failures = [];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.addInitScript(() => {
      localStorage.setItem(
        "workflow_user",
        JSON.stringify({
          email: "alex.rivera@workflow.com",
          name: "Alex Rivera",
          mustChangePassword: false,
        })
      );
      localStorage.setItem("workflow_workspace", "ws-demo");
    });

    await page.route(`${supabaseRest}/**`, async (route) => {
      const table = new URL(route.request().url()).pathname.split("/").pop();
      const rows = mockRows[table] ?? [];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": `0-${Math.max(rows.length - 1, 0)}/${rows.length}` },
        body: JSON.stringify(rows),
      });
    });

    page.setDefaultTimeout(15000);
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });
    if (await page.getByText("Task Completion Rate").isVisible()) {
      failures.push(`${viewport.name}: dashboard still renders analytics`);
    }

    await page.goto(`${baseUrl}/dashboard/analytics`, { waitUntil: "domcontentloaded" });
    await page.getByText("Task Completion Rate").waitFor({ timeout: 10000 });
    await page.waitForTimeout(500);

    for (const title of [
      "Task Completion Rate",
      "Member Overload",
      "Progress vs Overtime",
      "Department Activity",
      "Spending Breakdown",
    ]) {
      if (!(await page.getByText(title).isVisible())) {
        failures.push(`${viewport.name}: ${title} is not visible`);
      }
    }

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const charts = Array.from(document.querySelectorAll(".recharts-wrapper"));
      return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        blankCharts: charts.filter((chart) => chart.getBoundingClientRect().height < 120).length,
      };
    });

    if (metrics.scrollWidth > metrics.clientWidth + 8) {
      failures.push(
        `${viewport.name}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.clientWidth}px`
      );
    }

    if (metrics.blankCharts > 0) {
      failures.push(`${viewport.name}: ${metrics.blankCharts} chart container(s) too small`);
    }

    if (consoleErrors.length > 0) {
      failures.push(`${viewport.name}: console errors: ${consoleErrors.join(" | ")}`);
    }

    await page.screenshot({
      path: path.join(screenshotsDir, `analytics-${viewport.name}.png`),
      fullPage: true,
    });
    await page.close();
  }

  await browser.close();

  if (failures.length > 0) {
    throw new Error(failures.join("\n"));
  }

  console.log(`Analytics viewport checks passed. Screenshots: ${screenshotsDir}`);
} finally {
  killServer();
}

function task(id, projectId, title, status, assignee, createdAt) {
  return {
    id,
    workspace_id: "ws-demo",
    project_id: projectId,
    title,
    description: null,
    priority: "Medium",
    assignee,
    due_date: "Aug 20, 2026",
    status,
    submission: null,
    created_at: createdAt,
  };
}

function member(id, name, initials, email, department, role) {
  return {
    id,
    workspace_id: "ws-demo",
    name,
    initials,
    email,
    department,
    role,
    status: "Active",
    joined_date: "Jan 2026",
    created_at: "2026-08-01T08:00:00.000Z",
  };
}

function entry(id, taskId, projectId, userEmail, userName, startTime, durationSeconds) {
  return {
    id,
    workspace_id: "ws-demo",
    task_id: taskId,
    project_id: projectId,
    user_email: userEmail,
    user_name: userName,
    start_time: startTime,
    end_time: new Date(new Date(startTime).getTime() + durationSeconds * 1000).toISOString(),
    duration_seconds: durationSeconds,
    created_at: startTime,
  };
}

function spending(id, department, category, amount, spentAt) {
  return {
    id,
    workspace_id: "ws-demo",
    project_id: null,
    department,
    category,
    amount,
    spent_at: spentAt,
    note: null,
    created_at: `${spentAt}T08:00:00.000Z`,
  };
}

async function waitForServer() {
  const timeoutAt = Date.now() + 30000;
  while (Date.now() < timeoutAt) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error("Vite dev server did not start in time.");
}

function killServer() {
  if (!server.pid) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
      stdio: "ignore",
    });
    return;
  }

  server.kill();
}
