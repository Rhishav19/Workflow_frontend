import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";
import { ProjectsProvider } from "./context/ProjectsContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import { TimeTrackingProvider } from "./context/TimeTrackingContext.jsx";
import { MembersProvider } from "./context/MembersContext.jsx";
import { BudgetProvider } from "./context/BudgetContext.jsx";
import "./index.css";
import { AnnouncementsProvider } from "./context/AnnouncementContext.jsx";
import { DocsProvider } from "./context/DocsContext.jsx";
import { ActivityProvider } from "./context/ActivityContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <ProjectsProvider>
            <TasksProvider>
              <TimeTrackingProvider>
                <MembersProvider>
                  <AnnouncementsProvider>
                    <ActivityProvider>
                      <DocsProvider>
                        <NotificationsProvider>
                          <BudgetProvider>
                            
                              <App />
                            
                          </BudgetProvider>
                        </NotificationsProvider>
                      </DocsProvider>
                    </ActivityProvider>
                  </AnnouncementsProvider>
                </MembersProvider>
              </TimeTrackingProvider>
            </TasksProvider>
          </ProjectsProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);