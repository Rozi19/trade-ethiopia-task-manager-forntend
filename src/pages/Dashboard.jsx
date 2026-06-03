import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // STYLES
  const cardStyle = {
    background: "#f1f1f1",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    width: "120px",
  };

  const formBox = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "auto",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "10px",
    width: "100%",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
  };

  const taskCard = {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  };

  const btnGreen = {
    background: "green",
    color: "white",
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
  };

  const btnRed = {
    background: "red",
    color: "white",
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
  };

  // GET TASKS
  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/tasks", {
        headers: {
          Authorization: token,
        },
      });

      setTasks(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // GET STATS
  const getStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/tasks/stats", {
        headers: {
          Authorization: token,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // CREATE TASK
  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/tasks",
        {
          title,
          description,
          status: "pending",
          priority: "low",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTitle("");
      setDescription("");

      getTasks();
      getStats();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/tasks/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      getTasks();
      getStats();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // TOGGLE STATUS
  const toggleStatus = async (task) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/tasks/${task._id}`,
        {
          status:
            task.status === "completed"
              ? "pending"
              : "completed",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      getTasks();
      getStats();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // PROTECT DASHBOARD
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    getTasks();
    getStats();
  }, []);

  // SEARCH + FILTER
  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : task.status === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>📊 Task Dashboard</h1>

        <button
          onClick={logout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total</h3>
          <p>{stats.total}</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div style={cardStyle}>
          <h3>Completed</h3>
          <p>{stats.completed}</p>
        </div>
      </div>

      {/* CREATE TASK */}
      <div style={formBox}>
        <h2>Create Task</h2>

        <input
          style={inputStyle}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button style={buttonStyle} onClick={createTask}>
          ➕ Add Task
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <input
          style={inputStyle}
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={inputStyle}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* TASKS */}
      <div style={{ display: "grid", gap: "15px" }}>
        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No tasks found
          </p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} style={taskCard}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <p>
                Status: <b>{task.status}</b>
              </p>

              <p>
                Priority: <b>{task.priority}</b>
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={btnGreen}
                  onClick={() => toggleStatus(task)}
                >
                  Toggle
                </button>

                <button
                  style={btnRed}
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;