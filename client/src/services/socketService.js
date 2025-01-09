import io from 'socket.io-client';
import { useStore } from '../store';

class SocketService {
  constructor() {
    this.socket = null;
    this.store = useStore.getState();
  }

  connect() {
    this.socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    this.setupListeners();
  }

  setupListeners() {
    // Prize updates
    this.socket.on('prize:updated', (prize) => {
      const prizes = this.store.prizes.items.map((p) => (p.id === prize.id ? prize : p));
      this.store.setPrizes(prizes);
    });

    // New spin result
    this.socket.on('wheel:spin', (result) => {
      this.store.setWheelResult(result);
    });

    // Prize quantity updates
    this.socket.on('prize:quantity', ({ id, quantity }) => {
      const prizes = this.store.prizes.items.map((p) => (p.id === id ? { ...p, quantity } : p));
      this.store.setPrizes(prizes);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();
