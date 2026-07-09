import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, ArrowUp, Camera, ScrollText, ShieldCheck, ChevronDown } from 'lucide-react';
import { colors, radii } from '../theme';
import { SPARKLE_GREETINGS, SCREEN_HELP } from '../data/objects';
import { Markdown } from './Markdown';
import type { ChatMsg, ChatMode, ScreenId } from '../types';

interface SparkleChatSheetProps {
  context: string;
  onClose: () => void;
  /** State to open in: greeting (default) or the screen-context help flow. */
  mode?: ChatMode;
  /** The screen the help flow was launched from — selects the solution reply. */
  screenId?: ScreenId;
}

const CANNED_REPLY =
  "Got it — I've noted that. In the full experience I'd take care of this for you and confirm once it's done. Anything else you'd like help with?";

const HELP_PROMPT = 'Help me with the problem on my screen';

const CONTEXT_REPLY =
  "Thanks — I've got your screen, the app's current state, and your permission level. Give me a second to take a look and I'll walk you through what's going on.";

const CONTEXT_ITEMS = [
  { icon: Camera, label: 'Screenshot', detail: 'Current screen' },
  { icon: ScrollText, label: 'App state', detail: 'Live log' },
  { icon: ShieldCheck, label: 'Permission level', detail: 'Roles & access' },
];

/** Collapsible summary of what got shared. Collapsed by default — a compact
 *  icon row the user can expand only if they want the specifics. */
function ContextBundle() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, maxWidth: '100%' }}>
      {/* Trigger: subtle, background-free — 3 icons + one line of text.
          alignItems:flex-end keeps it anchored so opening doesn't shift it. */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '2px 0', border: 'none', background: 'none', cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {CONTEXT_ITEMS.map(item => (
            <item.icon key={item.label} size={14} color={colors.textTertiary} />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: colors.textSecondary }}>
          Shared {CONTEXT_ITEMS.length} items with Help Agent
        </span>
        <ChevronDown
          size={14}
          color={colors.textTertiary}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        />
      </button>

      {/* Expanded detail bubble */}
      {open && (
        <div style={{
          display: 'flex', gap: 8, padding: 12,
          borderRadius: 14,
          background: colors.surfaceAlt,
        }}>
          {CONTEXT_ITEMS.map(item => (
            <div key={item.label} style={{
              flex: 1, display: 'flex', flexDirection: 'column', gap: 4,
              padding: 8, borderRadius: 10, background: colors.surface,
            }}>
              <item.icon size={16} color={colors.brandTeal} />
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.textPrimary }}>{item.label}</div>
              <div style={{ fontSize: 10, color: colors.textSecondary }}>{item.detail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SparkleChatSheet({ context, onClose, mode = 'greeting', screenId }: SparkleChatSheetProps) {
  const greeting: ChatMsg = {
    id: 1, role: 'assistant', text: SPARKLE_GREETINGS[context] ?? SPARKLE_GREETINGS['Help Agent'],
  };
  const [messages, setMessages] = useState<ChatMsg[]>(
    mode === 'help'
      ? [greeting, { id: 2, role: 'user', text: HELP_PROMPT, context: true }, { id: 3, role: 'assistant', text: CONTEXT_REPLY }]
      : [greeting],
  );
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const solutionSent = useRef(false);

  // Draggable sheet: two snap points (default / full-screen), plus a pull-down
  // dismiss. Height is a % of the phone frame; the handle drives it live.
  const SNAP_DEFAULT = 78;
  const SNAP_FULL = 100;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(SNAP_DEFAULT);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startY: number; startH: number; frameH: number; current: number } | null>(null);

  const onHandleDown = (e: React.PointerEvent) => {
    const frameH = wrapperRef.current?.offsetHeight ?? 0;
    if (!frameH) return;
    drag.current = { startY: e.clientY, startH: sheetHeight, frameH, current: sheetHeight };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHandleMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const deltaPct = ((d.startY - e.clientY) / d.frameH) * 100; // drag up → grow
    const next = Math.max(30, Math.min(SNAP_FULL, d.startH + deltaPct));
    d.current = next;
    setSheetHeight(next);
  };

  const onHandleUp = () => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    if (d.current < 45) { onClose(); return; } // pulled far enough down → dismiss
    setSheetHeight(d.current > 88 ? SNAP_FULL : SNAP_DEFAULT);
  };

  useEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    const last = messages[messages.length - 1];
    const el = lastMsgRef.current;
    // A reply too tall to fit shouldn't be yanked to its bottom — bring its TOP
    // into view so the user reads from the start and scrolls at their own pace.
    // Short turns (user messages, brief replies) still snap to the bottom.
    if (last?.role === 'assistant' && el && el.offsetHeight > c.clientHeight * 0.9) {
      c.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' });
    } else {
      c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, typing]);

  // Screen-context help: once the shared context has been acknowledged, the Help
  // Agent follows up with the solution for the current screen's blocker (once).
  // Invoked from BOTH entry points — the contextual "Help Agent" button (help
  // mode, on mount) and the in-chat "Help me with the problem" chip.
  function deliverScreenSolution() {
    const solution = screenId ? SCREEN_HELP[screenId] : undefined;
    if (!solution || solutionSent.current) return;
    setTyping(true);
    // Guard the append (not the scheduling) so StrictMode's double-invoke lands
    // exactly one reply instead of clearing the only timer.
    setTimeout(() => {
      if (solutionSent.current) return;
      solutionSent.current = true;
      setTyping(false);
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', text: solution, markdown: true }]);
    }, 1600);
  }

  useEffect(() => {
    if (mode === 'help') deliverScreenSolution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, screenId]);

  const push = (msg: Omit<ChatMsg, 'id'>, reply: string) => {
    setMessages(prev => [...prev, { ...msg, id: prev.length + 1 }]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', text: reply }]);
    }, 1100);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    // The first free-typed question gets the staged screen solution (if one
    // exists and hasn't been delivered yet); later messages fall back to the
    // generic canned reply.
    const solution = screenId ? SCREEN_HELP[screenId] : undefined;
    if (solution && !solutionSent.current) {
      setMessages(prev => [...prev, { role: 'user', text, id: prev.length + 1 }]);
      setDraft('');
      deliverScreenSolution();
      return;
    }
    push({ role: 'user', text }, CANNED_REPLY);
  };

  const sendScreenContext = () => {
    setMessages(prev => [...prev, { id: prev.length + 1, role: 'user', text: HELP_PROMPT, context: true }]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', text: CONTEXT_REPLY }]);
      // Then continue straight into the screen-specific answer.
      deliverScreenSolution();
    }, 1100);
  };

  // The help chip is a first-move shortcut: hide it once the user has sent
  // anything or has started composing their own message.
  const showHelpChip = !draft.trim() && !messages.some(m => m.role === 'user');

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* Dim backdrop — tap to dismiss */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: colors.overlay }} />

      {/* Bottom sheet */}
      <div style={{
        position: 'relative', height: `${sheetHeight}%`, background: colors.surface,
        borderTopLeftRadius: sheetHeight >= SNAP_FULL ? 0 : radii.modal,
        borderTopRightRadius: sheetHeight >= SNAP_FULL ? 0 : radii.modal,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.25)',
        animation: 'sparkle-sheet-in 0.25s ease-out',
        transition: dragging ? 'none' : 'height 0.25s ease, border-radius 0.25s ease',
      }}>
        <style>{'@keyframes sparkle-sheet-in { from { transform: translateY(100%); } to { transform: translateY(0); } }'}</style>

        {/* Drag handle — pull up to full screen, down to collapse or dismiss */}
        <div
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          style={{
            display: 'flex', justifyContent: 'center', padding: '10px 0 6px',
            cursor: 'grab', touchAction: 'none', flexShrink: 0,
          }}
        >
          <div style={{ width: 40, height: 5, borderRadius: 3, background: colors.border }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px 12px', borderBottom: `1px solid ${colors.borderLight}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: colors.brandTealLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={18} color={colors.brandTeal} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>Help Agent</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>powered by Scout</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close chat" style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex',
          }}>
            <X size={22} color={colors.textSecondary} strokeWidth={2} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg, i) => (
            <div key={msg.id} ref={i === messages.length - 1 ? lastMsgRef : undefined} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '82%', display: 'flex', flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 6,
            }}>
              <div style={{
                padding: '10px 14px', fontSize: 14, lineHeight: 1.45,
                borderRadius: 14,
                borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
                borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 14,
                background: msg.role === 'user' ? colors.brandTeal : colors.surfaceAlt,
                color: msg.role === 'user' ? '#fff' : colors.textPrimary,
                whiteSpace: msg.markdown ? 'normal' : 'pre-wrap',
              }}>
                {msg.markdown ? <Markdown text={msg.text} /> : msg.text}
              </div>
              {msg.context && <ContextBundle />}
            </div>
          ))}
          {typing && (
            <div style={{
              alignSelf: 'flex-start', padding: '10px 14px', borderRadius: 14, borderBottomLeftRadius: 4,
              background: colors.surfaceAlt, fontSize: 14, color: colors.textSecondary,
            }}>
              Help Agent is typing…
            </div>
          )}
        </div>

        {/* Suggested action — first-move shortcut, hidden once chatting */}
        {showHelpChip && (
          <div style={{ padding: '10px 12px 0', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={sendScreenContext}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: radii.pill,
                border: `1px solid ${colors.brandTeal}`, background: colors.brandTealLight,
                color: colors.brandTeal, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={15} color={colors.brandTeal} />
              {HELP_PROMPT}
            </button>
          </div>
        )}

        {/* Composer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px 14px', borderTop: `1px solid ${colors.borderLight}`,
        }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Message Help Agent…"
            style={{
              flex: 1, padding: '12px 14px', borderRadius: radii.pill,
              border: `1px solid ${colors.border}`, fontSize: 14, outline: 'none',
              fontFamily: 'inherit', color: colors.textPrimary, background: colors.surface,
            }}
          />
          <button
            onClick={send}
            aria-label="Send"
            disabled={!draft.trim()}
            style={{
              width: 42, height: 42, borderRadius: '50%', border: 'none',
              background: draft.trim() ? colors.brandTeal : colors.border,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: draft.trim() ? 'pointer' : 'default', flexShrink: 0,
            }}
          >
            <ArrowUp size={20} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
