import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";
import { ProjectsProvider } from "./context/ProjectsContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import { MembersProvider } from "./context/MembersContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <ProjectsProvider>
            <TasksProvider>
              <MembersProvider>
                <App />
              </MembersProvider>
            </TasksProvider>
          </ProjectsProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);