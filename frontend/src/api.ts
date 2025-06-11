import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

export const signinUser = async (formData) => {
  return axios.post(`${API_URL}/signin`, formData);
};

export const signupUser = async (formData) => {
  return axios.post(`${API_URL}/signup`, formData);
};

export const logoutUser = () => {
  // Clear tokens or user data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const predictFrame = async (formData) => {
  return axios.post(`${API_URL}/predict-frame`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const validateToken = async (token) => {
  return axios.get(`${API_URL}/authenticate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfile = async (formData, token) => {
  return axios.put(`${API_URL}/update-profile`, formData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};
