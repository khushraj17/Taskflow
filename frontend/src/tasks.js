
import { apiRequest } from "./api";

export function getTasks({
  limit = 10,
  offset = 0,
  search = "",
  completed = "",
} = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (completed !== "") {
    params.set("completed", String(completed));
  }

  return apiRequest(`/tasks?${params.toString()}`);
}

export function createTask(title) {
  return apiRequest("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}

export function updateTask(taskId, updates) {
  return apiRequest(`/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export function deleteTask(taskId) {
  return apiRequest(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}
