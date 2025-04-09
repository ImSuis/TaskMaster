import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getTasksApi, createTaskApi, deleteTaskApi } from '../api/api';
import '../styles/CozyStyles.css';

const Dashboard = () => {
  const { user, logout, tasks, setTasks, isLoading } = useAuth();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    } else if (user && !isLoading) {
      fetchTasks();
    }
  }, [user, isLoading, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await getTasksApi();
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const response = await createTaskApi({ title: newTaskTitle, description: newTaskDesc });
      setTasks([...tasks, response.data.task]);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setError(null);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskApi(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="min-vh-100">
      <header className="cozy-header">
        <div className="container d-flex justify-content-between align-items-center">
          <h1>TaskMaster</h1>
          <button className="cozy-btn-logout" onClick={logout} title="Sign out">
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </header>

      <main className="cozy-container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="cozy-greeting text-center mb-5">
              <h2>Hello, {user?.name || 'Friend'}!</h2>
              <p>Jot down your to-dos here.</p>
            </div>

            <div className="cozy-card animate__animated animate__fadeInUp">
              <div className="cozy-card-body">
                <h3 className="cozy-card-title">Add a Task</h3>
                {error && (
                  <div className="cozy-alert alert-dismissible fade show" role="alert">
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                )}
                <form onSubmit={handleAddTask}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="cozy-input form-control"
                      placeholder="What’s on your mind?"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="cozy-textarea form-control"
                      rows="3"
                      placeholder="Any details to add?"
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="cozy-btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2 cozy-spinner" role="status"></span>
                    ) : (
                      <i className="bi bi-plus-circle me-2"></i>
                    )}
                    Add to Your List
                  </button>
                </form>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border cozy-spinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-5 cozy-empty animate__animated animate__fadeIn">
                <i className="bi bi-cup-hot display-4 d-block mb-3"></i>
                <p>Your list is empty—perfect time for a cozy break!</p>
              </div>
            ) : (
              <div className="row">
                {tasks.map((task) => (
                  <div key={task.id} className="col-12">
                    <div className="cozy-task-card animate__animated animate__fadeInUp">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="cozy-task-title">{task.title}</h5>
                          <p className="cozy-task-desc">
                            {task.description || 'No details yet'}
                          </p>
                        </div>
                        <button
                          className="cozy-btn-delete"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Remove task"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;