import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Tasks from "./pages/Tasks";
import Members from "./pages/Members";
import Docs from "./pages/Docs";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import CreateAccount from "./pages/admin/CreateAccount";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="members" element={<Members />} />
        <Route path="docs" element={<Docs />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin/create-account" element={<CreateAccount />} />
      </Route>
    </Routes>
  );
}

export default App;