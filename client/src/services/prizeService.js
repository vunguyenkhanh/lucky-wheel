import { cacheManager } from '../utils/cache';
import { BaseService } from './baseService';
import { socketService } from './socketService';

class PrizeService extends BaseService {
  constructor() {
    super('/prizes');
  }

  async getPrizes() {
    // Check cache first
    const cached = cacheManager.get('prizes');
    if (cached) return cached;

    // If not in cache, fetch from API
    const prizes = await this.get();

    // Store in cache
    cacheManager.set('prizes', prizes);

    return prizes;
  }

  async createPrize(data) {
    const prize = await this.post(data);

    // Invalidate cache
    cacheManager.delete('prizes');

    // Emit socket event
    socketService.socket?.emit('prize:created', prize);

    return prize;
  }

  async updatePrize(id, data) {
    const prize = await this.put(id, data);

    // Update cache
    const cached = cacheManager.get('prizes');
    if (cached) {
      const updated = cached.map((p) => (p.id === id ? prize : p));
      cacheManager.set('prizes', updated);
    }

    // Emit socket event
    socketService.socket?.emit('prize:updated', prize);

    return prize;
  }
}

export const prizeService = new PrizeService();
