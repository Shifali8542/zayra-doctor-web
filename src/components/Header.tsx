import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { ZayraLogo } from './ZayraLogo';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onProfileClick?: () => void;
  onBellClick?: () => void;
}

export const Header = ({ onProfileClick, onBellClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProfile = () => {
    if (onProfileClick) onProfileClick();
    else navigate('/profile');
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        <ZayraLogo />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onBellClick}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-divider)] bg-[var(--color-surface)] transition hover:opacity-80"
          aria-label="Notifications"
        >
          <Icon name="bell" size={18} color="var(--color-text-primary)" strokeWidth={1.8} />
        </button>
        <button
          onClick={handleProfile}
          className="transition hover:opacity-80"
          aria-label="Profile"
        >
          <Avatar
            initials={user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}` : '?'}
            size={40}
          />
        </button>
      </div>
    </div>
  );
};
