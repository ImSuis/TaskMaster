import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserApi } from '../api/api';
import '../styles/CozyStyles.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserApi({ name, email, password });
      navigate('/login');
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="cozy-page">
      <div className="cozy-card col-md-4">
        <div className="cozy-card-body">
          <h3 className="cozy-card-title text-center">Join the Cozy Club</h3>
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
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label cozy-label">
                Name
              </label>
              <input
                type="text"
                className="cozy-input form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              />
            </div>
            <button type="submit" className="cozy-btn-primary">
              <i className="bi bi-person-plus me-2"></i>
              Sign Up
            </button>
          </form>
          <p className="mt-3 text-center cozy-empty">
            Already have an account? <a href="/login" className="cozy-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;