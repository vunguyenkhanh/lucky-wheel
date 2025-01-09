import api from './axios';

export const wheelApi = {
  getPrizes: () => api.get('/prizes'),
  spin: () => api.post('/prizes/spin'),
};
