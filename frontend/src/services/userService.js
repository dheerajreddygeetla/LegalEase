import api from './api';

export const getProfile = async () => {
  return api.get('/users/profile');
};

export const updateProfile = async (userData) => {
  return api.put('/users/profile', userData);
};

export const changePassword = async (currentPassword, newPassword) => {
  return api.put('/users/password', { currentPassword, newPassword });
};

export const getStats = async () => {
  return api.get('/users/stats');
};

export const deleteAccount = async () => {
  return api.delete('/users/account');
};
