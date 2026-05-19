import { CloudOff } from 'lucide-react';
import { FullScreenError } from './FullScreenError';

interface OfflineChatProps {
  onRetry: () => void;
}

export function OfflineChat({ onRetry }: OfflineChatProps) {
  return (
    <FullScreenError
      icon={<CloudOff size={64} />}
      title="You're offline"
      subtext="Chatter needs an internet connection to load this conversation."
      onRetry={onRetry}
    />
  );
}
