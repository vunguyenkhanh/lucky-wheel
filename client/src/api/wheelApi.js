import axios from './axiosClient';

export const getWheelConfig = async () => {
  const response = await axios.get('/wheel/config');
  return response.data;
};

export const spin = async () => {
  const response = await axios.post('/wheel/spin');
  return response.data;
};

export const getSpinHistory = async () => {
  const response = await axios.get('/wheel/history');
  return response.data;
};
