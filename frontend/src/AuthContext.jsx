import React, { createContext, useState, useContext } from 'react';
import { loginUserApi, logoutUser } from './api/api';

// Create a Context to manage authentication state across the application
const AuthContext = createContext();

// AuthProvider is a component that wraps the entire app and provides authentication data
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      // If there is an error during parsing remove the invalid data from localStorage
      console.error('Failed to parse user from localStorage:', e);
      localStorage.removeItem('user');
      return null;
    }
  });
  // could be used to store tasks related to the user
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data) => {
    setIsLoading(true);
    try {
      const response = await loginUserApi(data);
      setUser(response.data.user || null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setTasks([]);
  };

  // Return the AuthContext.Provider to make authentication state available to the rest of the app
  return (
    <AuthContext.Provider value={{ user, login, logout, tasks, setTasks, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};