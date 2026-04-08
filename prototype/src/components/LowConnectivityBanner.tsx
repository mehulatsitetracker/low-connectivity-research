import React from "react";
import { useNetworkSpeed } from "../hooks/useNetworkSpeed";
import type { ConnectionQuality } from "../hooks/useNetworkSpeed";

interface Props {
  onPress?: () => void;
  overrideQuality?: ConnectionQuality | null;
}

/* Both slow and very-slow use the same warning color #FFB75D (sitetracker BannerAlert warning variant) */
const OFFLINE_BG = "#E0E0E0";
const OFFLINE_TEXT = "#555555";
const WARNING_BG = "#FFB75D";
const WARNING_TEXT = "#844800";

const config: Partial<
  Record<
    ConnectionQuality,
    { message: string; bg: string; text: string; navigable: boolean }
  >
> = {
  slow: {
    message: "Slow connection — things may take longer",
    bg: WARNING_BG,
    text: WARNING_TEXT,
    navigable: true,
  },
  "very-slow": {
    message: "Very slow connection — things may take longer",
    bg: WARNING_BG,
    text: WARNING_TEXT,
    navigable: true,
  },
  offline: {
    message: "Offline",
    bg: OFFLINE_BG,
    text: OFFLINE_TEXT,
    navigable: false,
  },
};

export const LowConnectivityBanner: React.FC<Props> = ({
  onPress,
  overrideQuality,
}) => {
  const { quality: liveQuality } = useNetworkSpeed();
  const quality = overrideQuality ?? liveQuality;
  const c = config[quality];
  if (!c) return null;

  return (
    <div
      onClick={c.navigable ? onPress : undefined}
      style={{
        background: c.bg,
        padding: "10px 16px",
        cursor: c.navigable ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
      }}
    >
      {c.navigable ? (
        /* Warning triangle icon */
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path d="M8 1L15 14H1L8 1Z" fill={c.text} opacity="0.7" />
          <path
            d="M8 6V9"
            stroke={c.text}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11.5" r="0.75" fill={c.text} />
        </svg>
      ) : (
        /* Wifi-off icon for offline */
        <svg
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M1 5.5C3.5 3 6 2 9 2C12 2 14.5 3 17 5.5"
            stroke={c.text}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M4 9C5.5 7.5 7 7 9 7C11 7 12.5 7.5 14 9"
            stroke={c.text}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle cx="9" cy="13" r="1.5" fill={c.text} opacity="0.6" />
          <line
            x1="2"
            y1="16"
            x2="16"
            y2="2"
            stroke={c.text}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span
        style={{
          flex: 1,
          color: c.text,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "system-ui",
        }}
      >
        {c.message}
      </span>
      {c.navigable ? (
        /* Chevron for slow/very-slow */
        <svg
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M1 1L7 7L1 13"
            stroke={c.text}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        /* Info circle icon for offline */
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <circle cx="9" cy="9" r="7.5" stroke={c.text} strokeWidth="1.3" opacity="0.6" />
          <path d="M9 8V13" stroke={c.text} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="5.5" r="0.8" fill={c.text} />
        </svg>
      )}
    </div>
  );
};
