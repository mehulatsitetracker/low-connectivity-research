import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export function CheckmarkIcon({ size = 14, color = '#00847C', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path
        d="M13.5 4.5L6.5 11.5L2.5 7.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BranchIcon({ size = 14, color = '#00847C', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path
        d="M6 3V10C6 11.1046 6.89543 12 8 12H12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="3" r="2" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function WarningIcon({ size = 14, color = '#00847C', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path
        d="M8 1L15 14H1L8 1Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="8" y1="6" x2="8" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="12" r="0.75" fill={color} />
    </svg>
  );
}

export function GridIcon({ size = 14, color = '#00847C', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <rect x="1" y="1" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 16, color = '#999', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path
        d="M10 3L5 8L10 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, color = '#999', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path
        d="M6 3L11 8L6 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ size = 16, color = '#999', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <rect x="3" y="1" width="10" height="14" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <line x1="6" y1="12" x2="10" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DiagramIcon({ size = 16, color = '#999', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <rect x="1" y="3" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.2" fill="none" />
      <rect x="6" y="3" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.2" fill="none" />
      <rect x="11" y="3" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.2" fill="none" />
      <rect x="3.5" y="10" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.2" fill="none" />
      <rect x="8.5" y="10" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.2" fill="none" />
      <line x1="3" y1="6" x2="5.5" y2="10" stroke={color} strokeWidth="1" />
      <line x1="8" y1="6" x2="5.5" y2="10" stroke={color} strokeWidth="1" />
      <line x1="13" y1="6" x2="10.5" y2="10" stroke={color} strokeWidth="1" />
    </svg>
  );
}

export function SplitIcon({ size = 16, color = '#999', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <rect x="1" y="1" width="6" height="14" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="9" y="1" width="6" height="14" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function SettingsIcon({ size = 14, color = '#999', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <circle cx="8" cy="8" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
      <path
        d="M8 1V3M8 13V15M1 8H3M13 8H15M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M3.05 12.95L4.46 11.54M11.54 4.46L12.95 3.05"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const categoryIcons = {
  checkmark: CheckmarkIcon,
  branch: BranchIcon,
  warning: WarningIcon,
  grid: GridIcon,
} as const;
