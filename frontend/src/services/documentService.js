import api from './api';

export const uploadDocument = async (formData) => {
  return api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getDocuments = async () => {
  return api.get('/documents');
};

export const getDocument = async (id) => {
  return api.get(`/documents/${id}`);
};

export const deleteDocument = async (id) => {
  return api.delete(`/documents/${id}`);
};
