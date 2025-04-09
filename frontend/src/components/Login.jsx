import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/CozyStyles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      // Extract the specific error message from the backend response
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="cozy-page">
      <div className="cozy-card col-md-4">
        <div className="cozy-card-body">
          <h3 className="cozy-card-title text-center">Welcome Back</h3>
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
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label cozy-label">
                Email
              </label>
              <input
                type="email"
                className="cozy-input form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label cozy-label">
                Password
              </label>
              <input
                type="password"
                className="cozy-input form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                <i className="bi bi-door-open me-2"></i>
              )}
              Sign In
            </button>
          </form>
          <p className="mt-3 text-center cozy-empty">
            Need an account? <a href="/register" className="cozy-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;