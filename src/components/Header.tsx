import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { mockDoctorProfile } from '@/mocks/mockData';

interface HeaderProps {
  onProfileClick?: () => void;
  onBellClick?: () => void;
}

export const Header = ({ onProfileClick, onBellClick }: HeaderProps) => {
  const navigate = useNavigate();

  const handleProfile = () => {
    if (onProfileClick) onProfileClick();
    else navigate('/profile');
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        {/* Brand: Pulse icon + ZAYRA wordmark */}
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary)]">
          <Icon name="pulse" size={18} color="#1FA59B" strokeWidth={2.4} />
        </div>
        <span className="text-[16px] font-bold tracking-[3px] text-[var(--color-text-primary)]">
          ZAYRA
        </span>
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
          <Avatar initials={mockDoctorProfile.initials} size={40} />
        </button>
      </div>
    </div>
  );
};
