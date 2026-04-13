import { useState, useRef, useEffect } from 'react';
import { colors, radii } from '../theme';
import { Avatar } from './Avatar';
import { Paperclip, Send, X, Camera, Image, File, Check } from 'lucide-react';

const MENTIONABLE_USERS = [
  { name: 'Jane Smith', initials: 'JS' },
  { name: 'Mike Torres', initials: 'MT' },
  { name: 'Sarah Chen', initials: 'SC' },
  { name: 'David Kim', initials: 'DK' },
  { name: 'Priya Patel', initials: 'PP' },
  { name: 'Alex Rivera', initials: 'AR' },
  { name: 'John Doe', initials: 'JD' },
];

const FAKE_PHOTOS = [
  { id: 'p1', name: 'site-progress-01.jpg', color: '#5D7B3A', gradient: 'linear-gradient(135deg, #5D7B3A 0%, #8B9B3A 50%, #4A6741 100%)' },
  { id: 'p2', name: 'crew-onsite-02.jpg', color: '#D84315', gradient: 'linear-gradient(145deg, #D84315 0%, #E65100 50%, #BF360C 100%)' },
  { id: 'p3', name: 'foundation-work.jpg', color: '#E65100', gradient: 'linear-gradient(155deg, #E65100 0%, #FF8F00 50%, #D84315 100%)' },
  { id: 'p4', name: 'equipment-check.jpg', color: '#BF360C', gradient: 'linear-gradient(135deg, #BF360C 0%, #D84315 50%, #E65100 100%)' },
];

export interface PendingAttachment {
  name: string;
  type: 'photo' | 'file' | 'camera';
  color: string;
}

interface MessageInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  onSendWithAttachment?: (attachments: PendingAttachment[]) => void;
}

function getMentionQuery(text: string): string | null {
  const match = text.match(/@(\w*)$/);
  return match ? match[1].toLowerCase() : null;
}

function UploadSheet({ onClose, onConfirm, selectedIds, onTogglePhoto, onSelectType }: {
  onClose: () => void;
  onConfirm: () => void;
  selectedIds: Set<string>;
  onTogglePhoto: (photo: typeof FAKE_PHOTOS[0]) => void;
  onSelectType: (type: string) => void;
}) {
  const uploadOptions = [
    { id: 'camera', label: 'Camera', Icon: Camera },
    { id: 'gallery', label: 'Gallery', Icon: Image },
    { id: 'file', label: 'File', Icon: File },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 20 }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: colors.surface, borderRadius: '16px 16px 0 0',
        zIndex: 21, padding: '12px 16px 20px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: colors.border }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Upload</span>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            border: `1px solid ${colors.border}`, background: colors.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <X size={16} color={colors.textSecondary} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {uploadOptions.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => onSelectType(id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8, padding: '16px 8px',
              background: colors.surfaceAlt, border: `1px solid ${colors.borderLight}`,
              borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Icon size={28} color={colors.textPrimary} strokeWidth={1.5} />
              <span style={{ fontSize: 13, fontWeight: 500, color: colors.textPrimary }}>{label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.textSecondary }}>Recent photos</span>
          {selectedIds.size > 0 && (
            <span style={{ fontSize: 12, color: colors.brandTeal, fontWeight: 600 }}>
              {selectedIds.size} selected
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: selectedIds.size > 0 ? 14 : 0 }}>
          {FAKE_PHOTOS.map((photo) => {
            const isSelected = selectedIds.has(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => onTogglePhoto(photo)}
                style={{
                  width: 72, height: 72, borderRadius: 10,
                  background: photo.gradient,
                  cursor: 'pointer', position: 'relative',
                  border: isSelected ? `2.5px solid ${colors.brandTeal}` : '2.5px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Image size={24} color="rgba(255,255,255,0.35)" />
                {isSelected ? (
                  <div style={{
                    position: 'absolute', top: 3, right: 3,
                    width: 22, height: 22, borderRadius: '50%',
                    background: colors.brandTeal, border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </div>
                ) : (
                  <div style={{
                    position: 'absolute', top: 3, right: 3,
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.4)', border: '2px solid rgba(255,255,255,0.7)',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Attach button when photos selected */}
        {selectedIds.size > 0 && (
          <button
            onClick={onConfirm}
            style={{
              width: '100%', padding: '12px 0', borderRadius: radii.pill,
              border: 'none', background: colors.brandTeal, color: '#fff',
              fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Paperclip size={16} />
            Attach {selectedIds.size} {selectedIds.size === 1 ? 'photo' : 'photos'}
          </button>
        )}
      </div>
    </>
  );
}

export function MessageInput({ value, onChange, onSend, onSendWithAttachment }: MessageInputProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [filteredUsers, setFilteredUsers] = useState(MENTIONABLE_USERS);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasContent = value.trim() || pendingAttachments.length > 0;

  useEffect(() => {
    const query = getMentionQuery(value);
    if (query !== null) {
      const filtered = MENTIONABLE_USERS.filter(u =>
        u.name.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
      setShowMentions(filtered.length > 0);
    } else {
      setShowMentions(false);
    }
  }, [value]);

  const handleSelectMention = (userName: string) => {
    const newValue = value.replace(/@\w*$/, `@${userName} `);
    onChange(newValue);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (pendingAttachments.length > 0 && onSendWithAttachment) {
      onSendWithAttachment(pendingAttachments);
      setPendingAttachments([]);
      setSelectedPhotoIds(new Set());
    } else if (value.trim()) {
      onSend();
    }
  };

  const handleTogglePhoto = (photo: typeof FAKE_PHOTOS[0]) => {
    setSelectedPhotoIds(prev => {
      const next = new Set(prev);
      if (next.has(photo.id)) {
        next.delete(photo.id);
      } else {
        next.add(photo.id);
      }
      return next;
    });
  };

  const handleConfirmPhotos = () => {
    const selected = FAKE_PHOTOS.filter(p => selectedPhotoIds.has(p.id));
    setPendingAttachments(selected.map(p => ({ name: p.name, type: 'photo', color: p.color })));
    setShowUpload(false);
    inputRef.current?.focus();
  };

  const handleSelectType = (type: string) => {
    const fakeNames: Record<string, string> = {
      camera: 'photo-' + Date.now() + '.jpg',
      gallery: 'gallery-photo.jpg',
      file: 'document-report.pdf',
    };
    setPendingAttachments(prev => [...prev, {
      name: fakeNames[type] || 'file.bin',
      type: type as PendingAttachment['type'],
      color: type === 'file' ? colors.textSecondary : '#D84315',
    }]);
    setShowUpload(false);
    inputRef.current?.focus();
  };

  const removeAttachment = (idx: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== idx));
    // Also remove from selectedPhotoIds if it was a photo
    const removed = pendingAttachments[idx];
    if (removed) {
      const matchedPhoto = FAKE_PHOTOS.find(p => p.name === removed.name);
      if (matchedPhoto) {
        setSelectedPhotoIds(prev => {
          const next = new Set(prev);
          next.delete(matchedPhoto.id);
          return next;
        });
      }
    }
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {showUpload && (
        <UploadSheet
          onClose={() => setShowUpload(false)}
          onConfirm={handleConfirmPhotos}
          selectedIds={selectedPhotoIds}
          onTogglePhoto={handleTogglePhoto}
          onSelectType={handleSelectType}
        />
      )}

      {showMentions && !showUpload && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, right: 0,
          background: colors.surface, borderTop: `1px solid ${colors.border}`,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto', zIndex: 10,
        }}>
          {filteredUsers.map(user => (
            <div
              key={user.name}
              onClick={() => handleSelectMention(user.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', cursor: 'pointer',
                borderBottom: `1px solid ${colors.borderLight}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceAlt)}
              onMouseLeave={e => (e.currentTarget.style.background = colors.surface)}
            >
              <Avatar initials={user.initials} size={32} />
              <span style={{ fontSize: 14, fontWeight: 500, color: colors.textPrimary }}>{user.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pending attachments preview strip */}
      {pendingAttachments.length > 0 && (
        <div style={{
          display: 'flex', gap: 8, padding: '10px 16px',
          borderTop: `1px solid ${colors.borderLight}`, background: colors.surfaceAlt,
          overflowX: 'auto',
        }}>
          {pendingAttachments.map((att, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', borderRadius: 8,
              background: colors.surface, border: `1px solid ${colors.borderLight}`,
              flexShrink: 0, maxWidth: 180,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                background: att.type === 'file'
                  ? colors.surfaceAlt
                  : `linear-gradient(135deg, ${att.color} 0%, ${att.color}CC 100%)`,
                border: `1px solid ${colors.borderLight}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {att.type === 'file'
                  ? <File size={14} color={colors.textSecondary} />
                  : <Image size={14} color="rgba(255,255,255,0.7)" />
                }
              </div>
              <span style={{
                fontSize: 12, color: colors.textPrimary, fontWeight: 500,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
              }}>
                {att.name}
              </span>
              <button onClick={() => removeAttachment(idx)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                display: 'flex', alignItems: 'center', flexShrink: 0,
              }}>
                <X size={14} color={colors.textTertiary} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 16px',
        borderTop: pendingAttachments.length > 0 ? 'none' : `1px solid ${colors.borderLight}`,
        background: colors.surface,
      }}>
        <button onClick={() => setShowUpload(!showUpload)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 6, display: 'flex', alignItems: 'center', flexShrink: 0,
        }}>
          <Paperclip size={22} color={colors.textSecondary} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && hasContent && !showMentions) handleSend();
            if (e.key === 'Escape') { setShowMentions(false); setShowUpload(false); }
          }}
          placeholder={pendingAttachments.length > 0 ? 'Add a caption...' : 'Type a message...'}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: radii.pill,
            border: `1px solid ${colors.border}`, fontSize: 15, fontFamily: 'inherit',
            outline: 'none', background: colors.surface, color: colors.textPrimary,
          }}
        />
        <button onClick={handleSend} disabled={!hasContent} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: '50%', border: 'none',
          background: hasContent ? colors.brandTeal : colors.border,
          color: '#fff', cursor: hasContent ? 'pointer' : 'default',
          flexShrink: 0, transition: 'background 0.15s',
        }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
