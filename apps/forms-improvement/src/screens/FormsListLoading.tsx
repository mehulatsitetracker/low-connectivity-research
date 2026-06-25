import { useEffect, useRef } from 'react';
import type { Variant } from '../types';
import { C, TopBar, BottomNav, SearchBar, Spinner, Icons, IconBtn, spinKeyframes } from './_bits';

// Now: slow round-trip to the server before any rows can render.
// Improved: cached list paints almost immediately; only a brief skeleton flash.
const NOW_DELAY_MS = 5000;
const IMPROVED_DELAY_MS = 800;

export function FormsListLoading({ variant, onDone }: { variant: Variant; onDone?: () => void }) {
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  useEffect(() => {
    const delay = variant === 'now' ? NOW_DELAY_MS : IMPROVED_DELAY_MS;
    const id = window.setTimeout(() => onDoneRef.current?.(), delay);
    return () => window.clearTimeout(id);
  }, [variant]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.background }}>
      {spinKeyframes}
      <TopBar
        title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Forms {Icons.caretDown('#fff', 12)}</span>}
        onBack={() => {}}
        trailing={<IconBtn>{Icons.plus()}</IconBtn>}
      />
      <SearchBar />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {variant === 'now' ? <NowState /> : <ImprovedState />}
      </div>
      <BottomNav />
    </div>
  );
}

function NowState() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner />
    </div>
  );
}

function ImprovedState() {
  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          background: C.surface, borderRadius: 6, border: `1px solid ${C.borderLight}`,
          padding: 14, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <Bar w="70%" h={14} />
          <Bar w="50%" h={10} />
          <Bar w="40%" h={10} />
          <Bar w="55%" h={10} />
        </div>
      ))}
    </div>
  );
}

function Bar({ w, h }: { w: string; h: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 4,
      background: 'linear-gradient(90deg, #ECECEE 0%, #F5F5F7 50%, #ECECEE 100%)',
      backgroundSize: '200% 100%',
      animation: 'fi-shimmer 1.4s ease-in-out infinite',
    }} />
  );
}
