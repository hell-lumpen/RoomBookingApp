import api from './api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data.token;
  } catch (error) {
    throw error;
  }
};

export const register = async (username, password) => {
  try {
    const response = await api.post('/api/auth/register', { username, password });
    return response.data.token;
  } catch (error) {
    throw error;
  }
};