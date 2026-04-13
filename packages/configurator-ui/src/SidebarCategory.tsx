import { theme } from './theme';
import { categoryIcons } from './icons';
import { SidebarStep } from './SidebarStep';
import type { Category } from './types';

interface SidebarCategoryProps {
  category: Category;
  activeStepId: string;
  onStepSelect: (stepId: string) => void;
}

export function SidebarCategory({ category, activeStepId, onStepSelect }: SidebarCategoryProps) {
  const IconComponent = category.icon ? categoryIcons[category.icon] : null;

  return (
    <div style={{ marginBottom: theme.spacing.categoryGap }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 10,
        }}
      >
        {IconComponent && <IconComponent size={14} color={theme.colors.categoryLabel} />}
        <span
          style={{
            fontSize: theme.font.sizeXs,
            fontWeight: theme.font.weightBold,
            letterSpacing: '1.2px',
            textTransform: 'uppercase' as const,
            color: theme.colors.categoryLabel,
          }}
        >
          {category.label}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: theme.spacing.stepGap }}>
        {category.steps.map((step) => (
          <SidebarStep
            key={step.id}
            step={step}
            isActive={step.id === activeStepId}
            onClick={() => onStepSelect(step.id)}
          />
        ))}
      </div>
    </div>
  );
}
