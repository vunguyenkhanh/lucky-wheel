import axiosClient from './axiosClient';

export const getPrizes = async () => {
  const response = await axiosClient.get('/prizes');
  return response.data;
};

export const createPrize = async (data) => {
  const response = await axiosClient.post('/prizes', data);
  return response.data;
};

export const updatePrize = async (id, data) => {
  const response = await axiosClient.put(`/prizes/${id}`, data);
  return response.data;
};

export const deletePrize = async (id) => {
  const response = await axiosClient.delete(`/prizes/${id}`);
  return response.data;
};

export const getPrize = async (id) => {
  const response = await axiosClient.get(`/prizes/${id}`);
  return response.data;
};
