import { CloudOff } from 'lucide-react';
import { FullScreenError } from './FullScreenError';

export function OfflineNotifications({ onRetry }: { onRetry: () => void }) {
  return (
    <FullScreenError
      icon={<CloudOff size={64} />}
      title="You're offline"
      subtext="Notifications need an internet connection."
      onRetry={onRetry}
    />
  );
}
