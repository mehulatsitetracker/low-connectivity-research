import { useEffect, useRef } from 'react';
import type { Variant } from '../types';
import { C, TopBar, Pill, Spinner, Icons, IconBtn, spinKeyframes } from './_bits';

// Now: quick spinner — form definition is light, sections fetch on demand later.
// Improved: longer preload pulls full form + prior answers, so detail/sections feel instant.
const NOW_DELAY_MS = 800;
const IMPROVED_DELAY_MS = 1500;

export function FormLoading({ variant, onDone }: { variant: Variant; onDone: () => void }) {
  const isNow = variant === 'now';
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  useEffect(() => {
    const delay = isNow ? NOW_DELAY_MS : IMPROVED_DELAY_MS;
    const id = window.setTimeout(() => onDoneRef.current?.(), delay);
    return () => window.clearTimeout(id);
  }, [isNow]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.background }}>
      {spinKeyframes}
      <TopBar
        title=""
        dark={false}
        onBack={onDone}
        trailing={<IconBtn>{Icons.more()}</IconBtn>}
      />
      {/* Metadata already known from the list (title, site, status) — show immediately, don't gate behind loading. */}
      <div style={{ padding: '16px 16px 10px', background: C.surface, borderBottom: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.textPrimary, lineHeight: 1.35, marginBottom: 6 }}>
          Site Check-Out Form from Template ID:<br />a0gf6000000ZOUMAA4
        </div>
        <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 8 }}>WeWork Prestige Central</div>
        <Pill tone="gray">Not started</Pill>
      </div>

      {isNow ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </div>
      ) : (
        <ImprovedSkeleton />
      )}
    </div>
  );
}

function ImprovedSkeleton() {
  return (
    <div style={{ flex: 1, padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        background: C.pendingBg, borderRadius: 6, padding: '12px 14px',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 2,
          background: 'linear-gradient(90deg, #F0D699 0%, #FFE3A8 50%, #F0D699 100%)',
          backgroundSize: '200% 100%', animation: 'fi-shimmer 1.4s ease-in-out infinite',
        }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Bar w="85%" h={9} />
          <Bar w="60%" h={9} />
        </div>
      </div>

      {[0, 1, 2].map(i => (
        <div key={i} style={{
          background: C.surface, borderRadius: 6, border: `1px solid ${C.borderLight}`,
          padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Bar w="40%" h={9} />
            <Bar w={24} h={14} />
          </div>
          <Bar w="65%" h={13} />
        </div>
      ))}
    </div>
  );
}

function Bar({ w, h }: { w: number | string; h: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 4,
      background: 'linear-gradient(90deg, #ECECEE 0%, #F5F5F7 50%, #ECECEE 100%)',
      backgroundSize: '200% 100%',
      animation: 'fi-shimmer 1.4s ease-in-out infinite',
    }} />
  );
}
