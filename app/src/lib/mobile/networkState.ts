export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'UNKNOWN';

export type NetworkStatusListener = (status: NetworkStatus) => void;

export class MobileNetworkState {
  private status: NetworkStatus = 'ONLINE';
  private listeners: Set<NetworkStatusListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.status = navigator.onLine ? 'ONLINE' : 'OFFLINE';
      window.addEventListener('online', () => this.updateStatus('ONLINE'));
      window.addEventListener('offline', () => this.updateStatus('OFFLINE'));
    }
  }

  public getStatus(): NetworkStatus {
    return this.status;
  }

  public isOnline(): boolean {
    return this.status === 'ONLINE';
  }

  public subscribe(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateStatus(newStatus: NetworkStatus) {
    this.status = newStatus;
    this.listeners.forEach((listener) => listener(newStatus));
  }
}

export const mobileNetworkState = new MobileNetworkState();
