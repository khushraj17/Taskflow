
import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "./api";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./tasks";
import "./App.css";

const PAGE_SIZE = 10;

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");


  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;
  
  const pendingCount = tasks.filter(
    (task) => !task.completed
  ).length;

  const loadTasks = useCallback(async () => {
    const data = await getTasks({
      limit: PAGE_SIZE,
      offset,
      search,
      completed: filter,
    });

    setTasks(data);
  }, [offset, search, filter]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const profile = await apiRequest("/users/me");
      setUser(profile);

      await loadTasks();
    } catch (err) {
      if (err.status === 401) {
        onLogout();
      } else {
        setError(err.message || "Unable to load dashboard.");
      }
    } finally {
      setLoading(false);
    }
  }, [loadTasks, onLogout]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function runAction(action) {
    setBusy(true);
    setError("");

    try {
      await action();
    } catch (err) {
      if (err.status === 401) {
        onLogout();
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    await runAction(async () => {
      await createTask(cleanTitle);
      setTitle("");
      setOffset(0);

      // Reload using the first page after creation.
      const data = await getTasks({
        limit: PAGE_SIZE,
        offset: 0,
        search,
        completed: filter,
      });

      setTasks(data);
    });
  }

  async function handleToggle(task) {
    await runAction(async () => {
      await updateTask(task.id, {
        completed: !task.completed,
      });

      await loadTasks();
    });
  }

  async function handleDelete(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
  
    if (!confirmed) return;
  
    await runAction(async () => {
      await deleteTask(taskId);
  
      if (tasks.length === 1 && offset > 0) {
        setOffset((current) => Math.max(0, current - PAGE_SIZE));
      } else {
        await loadTasks();
      }
    });
  }

  if (loading) {
    return <main className="dashboard">Loading dashboard...</main>;
  }

  return (
    <main className="dashboard">
      <section className="dashboard-card">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">TASKFLOW WORKSPACE</p>
            <h1>My Tasks</h1>
            <p className="subtitle">
              {user?.email || "Your workspace"}
            </p>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        </header>

        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}

        <div className="stats-grid">
        <div className="stat-card">
            <span>Tasks on this page</span>
            <strong>{tasks.length}</strong>
        </div>

        <div className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
        </div>

        <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
        </div>
        </div>

        <form className="task-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="What needs to get done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            required
          />

          <button type="submit" disabled={busy}>
            Add Task
          </button>
        </form>

        <div className="task-tools">
          <input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setOffset(0);
            }}
          />

          <select
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setOffset(0);
            }}
            aria-label="Filter by task status"
          >
            <option value="">All tasks</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <div className="task-heading">
          <h2>Your tasks</h2>
          <span>{tasks.length} on this page</span>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Create a task or change your search and filters.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className="task-item" key={task.id}>
                <input
                  className="task-checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task)}
                  disabled={busy}
                  aria-label={`Mark ${task.title} completed`}
                />

                <div className="task-content">
                  <p className={task.completed ? "task-done" : ""}>
                    {task.title}
                  </p>

                  <span
                    className={
                      task.completed
                        ? "task-status completed"
                        : "task-status pending"
                    }
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                  disabled={busy}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}

        <div className="pagination">
          <button
            className="logout-button"
            disabled={offset === 0 || busy}
            onClick={() =>
              setOffset((current) =>
                Math.max(0, current - PAGE_SIZE)
              )
            }
          >
            Previous
          </button>

          <span>Page {Math.floor(offset / PAGE_SIZE) + 1}</span>

          <button
            className="logout-button"
            disabled={tasks.length < PAGE_SIZE || busy}
            onClick={() => setOffset((current) => current + PAGE_SIZE)}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
