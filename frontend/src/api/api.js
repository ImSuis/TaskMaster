import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://localhost:4001/api',
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
});

// Interceptor to add Authorization header with token from localStorage
Api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export const createUserApi = (data) => Api.post("/users/register", data);


export const loginUserApi = async (data) => {
    try {
      const response = await Api.post("/users/login", data);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Stringify user object before storing
      return response;
    } catch (error) {
      throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
  
// Task-related API calls
export const getTasksApi = async () => {
  try {
    const response = await Api.get("/tasks");
    return response;
  } catch (error) {
    throw error;
  }
};

export const createTaskApi = async (data) => {
  try {
    const response = await Api.post("/tasks", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteTaskApi = async (taskId) => {
  try {
    const response = await Api.delete(`/tasks/${taskId}`);
    return response;
  } catch (error) {
    throw error;
  }
};


export default Api;
  