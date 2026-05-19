import { ChevronLeft, Star, MoreVertical, ChevronRight } from 'lucide-react';
import { colors } from '../theme';
import { BottomNav } from '../components/BottomNav';
import { ConversationsWidget } from '../components/ConversationsWidget';
import { FormsWidget } from '../components/FormsWidget';
import { MessageIconButton } from '../components/MessageIconButton';
import { PROJECTS } from '../data/objects';
import type { ActiveTab, ChatMessage } from '../types';

interface ProjectDetailScreenProps {
  projectId: string;
  messages: ChatMessage[];
  activeTab: ActiveTab;
  onAction: (action: string) => void;
  unreadCount?: number;
}

export function ProjectDetailScreen({ projectId, messages, activeTab, onAction, unreadCount = 0 }: ProjectDetailScreenProps) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: colors.background }}>
      {/* TopBar — centered title like adhoc-job */}
      <div style={{
        height: 44, background: colors.topBar,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 40 }}>
          <button onClick={() => onAction('back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <ChevronLeft size={18} color="#fff" strokeWidth={2} />
          </button>
        </div>
        <div style={{ fontWeight: 600, fontSize: 17, color: '#fff', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {project.id}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MessageIconButton unreadCount={unreadCount} onClick={() => onAction('open-chat')} />
          <Star size={22} color="#fff" strokeWidth={1.5} style={{ opacity: 0.8 }} />
          <MoreVertical size={22} color="#fff" fill="#fff" style={{ opacity: 0.8 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Project info */}
        <div style={{ padding: '12px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}` }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: colors.textPrimary }}>{project.id}</div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>{project.siteName}</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 10, borderTop: `1px solid ${colors.borderLight}` }}>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>Project: --</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>Project Status: {project.status}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>Project Template: {project.templateName}</div>
          </div>
        </div>

        {/* Links */}
        {['Manage Project Schedule', 'View Project Details'].map(label => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: colors.surface, borderBottom: `1px solid ${colors.borderLight}`,
          }}>
            <span style={{ fontSize: 15, color: colors.brandTeal, fontWeight: 500 }}>{label}</span>
            <ChevronRight size={14} color={colors.brandTeal} strokeWidth={2} />
          </div>
        ))}

        {/* Forms */}
        <div style={{ margin: '10px 12px' }}>
          <FormsWidget
            showAddButton
            forms={[
              { name: 'Site Inspection - Checklist', status: 'Not Started', siteName: project.siteName },
              { name: 'Site Inspection - Compliance', status: 'Not Started', siteName: project.siteName },
              { name: 'Antenna Installation', status: 'In Progress', siteName: project.siteName },
              { name: 'Template2-Result Form', status: 'Not Started', siteName: project.siteName },
            ]}
          />
        </div>

        {/* Conversations Widget */}
        <div style={{ margin: '0 12px 12px' }}>
          <ConversationsWidget messages={messages} onTap={() => onAction('open-chat')} />
        </div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => onAction(`tab-${tab}`)} />
    </div>
  );
}
