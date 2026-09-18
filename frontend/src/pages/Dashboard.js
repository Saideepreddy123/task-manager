import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { getTasks, createTask, updateTask, deleteTask } from '../api/api';

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      const res = await getTasks(params);
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300); // debounce search input
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleAddClick = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const handleFormSubmit = async (taskData) => {
    setSubmitting(true);
    setError('');
    try {
      if (editingTask) {
        const res = await updateTask(editingTask.id, taskData);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? res.data : t)));
      } else {
        const res = await createTask(taskData);
        setTasks((prev) => [res.data, ...prev]);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <div className="header-right">
          {user?.email && <span className="user-email">{user.email}</span>}
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">View all Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button className="btn btn-primary" onClick={handleAddClick}>
          + Add Task
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="loading-state">Loading tasks...</p>
      ) : (
        <TaskList tasks={tasks} onEdit={handleEditClick} onDelete={handleDelete} />
      )}

      {showForm && (
        <TaskForm
          initialTask={editingTask}
          submitting={submitting}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
