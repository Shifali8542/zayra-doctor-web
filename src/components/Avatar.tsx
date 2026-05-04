import type { CSSProperties } from 'react';
import { cn } from '@/utils/format';

interface AvatarProps {
  initials: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  ringClassName?: string;
}

export const Avatar = ({
  initials,
  size = 36,
  className,
  style,
  ringClassName,
}: AvatarProps) => {
  const fontSize = Math.round(size * 0.42);
  return (
    <div
      className={cn(
        'overflow-hidden rounded-full border-2 border-[var(--color-surface)] flex items-center justify-center',
        ringClassName,
        className,
      )}
      style={{ width: size, height: size, ...style }}
    >
      <div
        className="avatar-gradient flex h-full w-full items-center justify-center"
        style={{ borderRadius: size / 2 }}
      >
        <span
          className="font-bold tracking-wider text-white"
          style={{ fontSize, letterSpacing: '0.5px' }}
        >
          {initials}
        </span>
      </div>
    </div>
  );
};
