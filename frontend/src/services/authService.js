import api from './api';

export const login = async (email, password, rememberMe = false) => {
  return api.post('/auth/login', { email, password, rememberMe });
};

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const googleAuth = async (idToken, rememberMe = false) => {
  return api.post('/auth/google', { idToken, rememberMe });
};

export const getMe = async () => {
  return api.get('/auth/me');
};
