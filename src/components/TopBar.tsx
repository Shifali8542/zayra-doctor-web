import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { mockDoctorProfile } from '@/mocks/mockData';

/**
 * TopBar — desktop-only header.
 * On mobile/tablet (<lg), the existing Header component renders instead.
 */
export const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 hidden h-[88px] items-center gap-6 border-b border-[var(--color-divider)] bg-[var(--color-surface)] px-8 lg:flex">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <Icon
            name="search"
            size={18}
            color="var(--color-text-tertiary)"
            strokeWidth={1.8}
          />
        </span>
        <input
          type="search"
          placeholder="Search cases, patients, ECG patterns…"
          className="h-12 w-full rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] pl-12 pr-5 text-[14px] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)]"
        />
      </div>

      <button
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-divider)] bg-[var(--color-surface)] transition hover:opacity-80"
        aria-label="Notifications"
      >
        <Icon
          name="bell"
          size={18}
          color="var(--color-text-primary)"
          strokeWidth={1.8}
        />
      </button>

      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-3 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] py-1 pl-1 pr-4 transition hover:opacity-80"
      >
        <Avatar initials={mockDoctorProfile.initials} size={36} />
        <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
          {mockDoctorProfile.name.split(' ').slice(-1)[0] === 'Rao'
            ? 'Dr. Rao'
            : mockDoctorProfile.name}
        </span>
      </button>
    </div>
  );
};