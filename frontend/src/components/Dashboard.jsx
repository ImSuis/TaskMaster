import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { createTaskApi, deleteTaskApi, getTasksApi } from '../api/api';

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
        <div className="min-vh-100 bg-light">
            {/* Sticky Header */}
            <header className="bg-primary text-white p-3 shadow-sm sticky-top">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="h4 mb-0 fw-bold">
                        TaskMaster
                    </h1>
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={logout}
                        title="Sign out"
                    >
                        <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        {/* Greeting */}
                        <div className="text-center mb-4">
                            <h2 className="display-6 fw-bold text-dark">
                                Welcome, {user?.name || 'User'}!
                            </h2>
                            <p className="text-muted">Manage your tasks with ease.</p>
                        </div>

                        {/* Task Form Card */}
                        <div className="card shadow-sm border-0 mb-5 animate__animated animate__fadeInUp">
                            <div className="card-body p-4">
                                <h3 className="card-title fw-semibold text-dark mb-3">Add a Task</h3>
                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
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
                                            className="form-control form-control-lg border-light"
                                            placeholder="Task title..."
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <textarea
                                            className="form-control border-light"
                                            rows="3"
                                            placeholder="Task description..."
                                            value={newTaskDesc}
                                            onChange={(e) => setNewTaskDesc(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        ) : (
                                            <i className="bi bi-plus-circle me-2"></i>
                                        )}
                                        Add Task
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Task List */}
                        {isLoading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-5 text-muted animate__animated animate__fadeIn">
                                <i className="bi bi-list-task display-4 d-block mb-3"></i>
                                <p className="fs-5">No tasks yet. Start by adding one above!</p>
                            </div>
                        ) : (
                            <div className="row">
                                {tasks.map((task) => (
                                    <div key={task.id} className="col-12 mb-3">
                                        <div className="card shadow-sm border-0 animate__animated animate__fadeInUp h-100">
                                            <div className="card-body d-flex justify-content-between align-items-center p-3">
                                                <div>
                                                    <h5 className="card-title mb-1 fw-semibold text-dark">{task.title}</h5>
                                                    <p className="card-text text-muted small mb-0">
                                                        {task.description || 'No description'}
                                                    </p>
                                                </div>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    title="Delete task"
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