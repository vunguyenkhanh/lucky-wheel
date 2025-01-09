import api from '../config/api';
import { handleApiError } from '../utils/errorHandler';

export class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async handleRequest(requestPromise) {
    try {
      const response = await requestPromise;
      return this.handleSuccess(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleSuccess(response) {
    return response.data;
  }

  handleError(error) {
    return handleApiError(error);
  }

  // CRUD methods
  async get(id = '', params = {}) {
    return this.handleRequest(api.get(`${this.endpoint}/${id}`, { params }));
  }

  async post(data) {
    return this.handleRequest(api.post(this.endpoint, data));
  }

  async put(id, data) {
    return this.handleRequest(api.put(`${this.endpoint}/${id}`, data));
  }

  async delete(id) {
    return this.handleRequest(api.delete(`${this.endpoint}/${id}`));
  }
}
