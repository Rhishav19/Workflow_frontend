import { createContext, useContext, useState } from "react";
import { initialTasks } from "../data/tasks";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);

  function addTask(task) {
    setTasks((prev) => [task, ...prev]);
  }

  function moveTask(taskId, newStatus) {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  }

  function changePriority(taskId, newPriority) {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, priority: newPriority } : task))
    );
  }

  function submitTask(taskId, submission) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: "Review", submission } : task
      )
    );
  }

  function approveTask(taskId) {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: "Done" } : task))
    );
  }

  function requestChanges(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: "In Progress", submission: null } : task
      )
    );
  }

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, moveTask, changePriority, submitTask, approveTask, requestChanges }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}