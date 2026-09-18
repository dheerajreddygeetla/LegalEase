import api from './api';

export const getSchemes = async (params = {}) => {
  return api.get('/schemes', { params });
};

export const getScheme = async (id) => {
  return api.get(`/schemes/${id}`);
};

export const getCategories = async () => {
  return api.get('/schemes/categories');
};

export const getStates = async () => {
  return api.get('/schemes/states');
};

export const recommendSchemes = async (profile) => {
  return api.post('/schemes/recommend', profile);
};

export const checkEligibility = async (schemeId, profile) => {
  return api.post(`/schemes/${schemeId}/check-eligibility`, profile);
};

export const toggleBookmark = async (schemeId) => {
  return api.post(`/schemes/${schemeId}/bookmark`);
};

export const getBookmarkedSchemes = async () => {
  return api.get('/schemes/user/bookmarked');
};
