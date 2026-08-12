import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Tasks from "./pages/Tasks";
import TimeTracking from "./pages/TimeTracking";
import Members from "./pages/Members";
import Activity from "./pages/Activity";
import Docs from "./pages/Docs";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import OrgChart from "./pages/OrgChart";
import CreateAccount from "./pages/admin/CreateAccount";
import AdminManagerRoute from "./components/AdminManagerRoute";
import Budget from "./pages/Budget";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="time-tracking" element={<TimeTracking />} />
          <Route path="members" element={<Members />} />
          <Route path="activity" element={<Activity />} />
          <Route path="docs" element={<Docs />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="settings" element={<Settings />} />
          <Route path="org-chart" element={<OrgChart />} />
            {/* Budget — Admin & Manager only */}
            <Route element={<AdminManagerRoute />}>
              <Route path="/dashboard/budget" element={<Budget />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard/admin/create-account" element={<CreateAccount />} />
            </Route>
          </Route>
        </Route>
    </Routes>
  );
}

export default App;
