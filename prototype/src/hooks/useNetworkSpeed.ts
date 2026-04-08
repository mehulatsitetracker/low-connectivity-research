import { useEffect, useState, useRef, useCallback } from 'react';

export type ConnectionQuality = 'good' | 'slow' | 'very-slow' | 'offline';

export interface NetworkSpeedInfo {
  quality: ConnectionQuality;
  downlinkMbps: number | null;
  latencyMs: number | null;
  connectionType: string;
}

const PING_URL = 'https://detectportal.firefox.com';
const CHECK_INTERVAL = 30_000;

const measureLatency = async (): Promise<number | null> => {
  try {
    const start = Date.now();
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10_000);
    const res = await fetch(PING_URL, { method: 'HEAD', cache: 'no-store', signal: ctrl.signal });
    clearTimeout(t);
    return res.ok ? Date.now() - start : null;
  } catch {
    return null;
  }
};

const classify = (ms: number | null, online: boolean): ConnectionQuality => {
  if (!online) return 'offline';
  if (ms === null) return 'offline';
  if (ms > 3000) return 'very-slow';
  if (ms > 1000) return 'slow';
  return 'good';
};

const estimateMbps = (ms: number | null): number | null => {
  if (ms === null) return null;
  if (ms < 200) return 10;
  if (ms < 500) return 5;
  if (ms < 1000) return 2;
  if (ms < 3000) return 0.5;
  return 0.1;
};

export const useNetworkSpeed = (): NetworkSpeedInfo => {
  const [info, setInfo] = useState<NetworkSpeedInfo>({
    quality: 'good', downlinkMbps: null, latencyMs: null, connectionType: 'unknown'
  });
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const check = useCallback(async () => {
    const online = navigator.onLine;
    const connectionType = (navigator as any).connection?.effectiveType ?? (online ? 'wifi' : 'none');
    if (!online) {
      setInfo({ quality: 'offline', downlinkMbps: null, latencyMs: null, connectionType: 'none' });
      return;
    }
    const latencyMs = await measureLatency();
    setInfo({
      quality: classify(latencyMs, online),
      downlinkMbps: estimateMbps(latencyMs),
      latencyMs,
      connectionType
    });
  }, []);

  useEffect(() => {
    check();
    interval.current = setInterval(check, CHECK_INTERVAL);
    window.addEventListener('online', check);
    window.addEventListener('offline', check);
    return () => {
      if (interval.current) clearInterval(interval.current);
      window.removeEventListener('online', check);
      window.removeEventListener('offline', check);
    };
  }, [check]);

  return info;
};
