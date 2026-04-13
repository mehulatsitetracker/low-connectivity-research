import type { ReactNode } from 'react';

export type ViewMode = 'phone' | 'diagram' | 'side-by-side';

export type CategoryIcon = 'checkmark' | 'branch' | 'warning' | 'grid';

export interface Step {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  icon?: CategoryIcon;
  steps: Step[];
}

export interface FlowNode {
  id: string;
  label: string;
  category: string;
  row?: number;
  scenarios?: string[];
  nodeType?: 'screen' | 'scenario';
}

export interface FlowEdge {
  from: string;
  to: string;
}

export interface ReferenceConfig {
  label: string;
  flowNodes: FlowNode[];
  flowEdges: FlowEdge[];
}

export interface BrandingConfig {
  logoSrc?: string;
  streamLabel: string;
  title: string;
  description: string;
}

export interface ConfiguratorConfig {
  branding: BrandingConfig;
  categories: Category[];
  reference?: ReferenceConfig;
  developerSettings?: ReactNode;
  customControls?: ReactNode;
  activeStepId: string;
  onStepSelect: (stepId: string) => void;
}
