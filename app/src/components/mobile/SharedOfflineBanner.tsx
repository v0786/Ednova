'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { mobileNetworkState, NetworkStatus } from '@/lib/mobile/networkState';

export default function SharedOfflineBanner() {
  const [status, setStatus] = useState<NetworkStatus>('ONLINE');

  useEffect(() => {
    setStatus(mobileNetworkState.getStatus());
    const unsubscribe = mobileNetworkState.subscribe((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsubscribe();
  }, []);

  if (status === 'ONLINE') return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3 rounded-xl flex items-center justify-between gap-3 text-xs font-mono mb-4">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span>You are currently offline. Some features may be unavailable.</span>
      </div>
      <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[10px] uppercase">Offline</span>
    </div>
  );
}
