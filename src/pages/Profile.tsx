import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { Toggle } from '@/components/Toggle';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/format';

const Row = ({
  label,
  description,
  rightSlot,
  borderless,
}: {
  label: string;
  description?: string;
  rightSlot: React.ReactNode;
  borderless?: boolean;
}) => (
  <div
    className={cn(
      'flex items-center py-3',
      !borderless && 'border-b border-[var(--color-divider)]',
    )}
  >
    <div className="flex-1">
      <p className="mb-0.5 text-[15px] font-semibold text-[var(--color-text-primary)]">
        {label}
      </p>
      {description ? (
        <p className="text-[13px] text-[var(--color-text-tertiary)]">
          {description}
        </p>
      ) : null}
    </div>
    <div>{rightSlot}</div>
  </div>
);

const KvRow = ({
  label,
  value,
  borderless,
}: {
  label: string;
  value: string;
  borderless?: boolean;
}) => (
  <div
    className={cn(
      'flex items-start py-3',
      !borderless && 'border-b border-[var(--color-divider)]',
    )}
  >
    <span className="flex-1 text-[14px] text-[var(--color-text-secondary)]">
      {label}
    </span>
    <span className="flex-[1.4] text-right text-[14px] font-semibold text-[var(--color-text-primary)]">
      {value}
    </span>
  </div>
);

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { mode, toggleMode } = useTheme();
  const {
    profile,
    available,
    emergencyOnly,
    lockScreenAlerts,
    hapticSound,
    toggleAvailable,
    toggleEmergency,
    setLockScreenAlerts,
    setHapticSound,
  } = useProfile();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppLayout>
      {/* Profile hero */}
      <div className="hero-gradient mt-4 flex flex-col items-center rounded-2xl p-6">
        <Avatar
          initials={profile ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}` : '?'}
          size={112}
          className="mb-4"
          ringClassName="!border-4 !border-white/20"
        />
        <p className="eyebrow mb-2 text-white/80" style={{ letterSpacing: '1.6px' }}>
          {profile?.role?.toUpperCase() ?? 'DOCTOR'}
        </p>
        <h1 className="mb-2 text-center text-[26px] font-bold text-white sm:text-[28px]">
          {profile ? `${profile.first_name} ${profile.last_name}` : '—'}
        </h1>
        <p className="mb-4 text-center text-[14px] text-white/80">
          {profile?.specialization ?? '—'} · {profile?.years_of_experience ?? '—'} years · {profile?.hospital_name ?? '—'}
        </p>
        <Tag onDark label={profile?.license_number ? 'License verified' : 'No license on file'} leftIcon={<Icon name="shield-check" size={13} color="#FFFFFF" />} className="mb-2 !bg-white/15" />
        <Tag onDark label={profile?.qualification ?? '—'} className="!bg-white/10" />
      </div>

      {/* Settings cards — 1 col mobile, 2 col desktop */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Availability */}
        <Card>
          <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
            Availability
          </h2>
          <Row
            label="Available for review"
            description="Receive live anomaly alerts"
            rightSlot={<Toggle value={available} onChange={toggleAvailable} />}
          />
          <Row
            label="Emergency-only mode"
            description="Only critical-tier cases"
            rightSlot={<Toggle value={emergencyOnly} onChange={toggleEmergency} />}
          />
          <KvRow label="License No." value={profile?.license_number ?? '—'} />
          <KvRow label="Qualification" value={profile?.qualification ?? '—'} borderless />
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
            Notifications
          </h2>
          <Row
            label="Lock-screen medical alerts"
            description="High-priority banner"
            rightSlot={
              <Toggle value={lockScreenAlerts} onChange={setLockScreenAlerts} />
            }
          />
          <Row
            label="Haptic + sound"
            description="Distinct tone per severity tier"
            rightSlot={<Toggle value={hapticSound} onChange={setHapticSound} />}
          />
          <KvRow label="Sound profile" value="Pulse · Soft" />
          <KvRow
            label="Quiet hours"
            value="23:00 – 07:00 (emergency override)"
            borderless
          />
        </Card>

        {/* App preferences */}
        <Card>
          <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
            App preferences
          </h2>
          <Row
            label="Theme"
            description={mode === 'light' ? 'Light · matches system' : 'Dark mode'}
            rightSlot={
              <button
                onClick={toggleMode}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-divider)] bg-[var(--color-surface)] transition hover:opacity-80"
                aria-label="Toggle theme"
              >
                <Icon
                  name={mode === 'light' ? 'sun' : 'moon'}
                  size={18}
                  color="var(--color-text-primary)"
                  strokeWidth={1.8}
                />
              </button>
            }
          />
          <KvRow
            label="AI transparency"
            value="Show evidence cards by default"
          />
          <KvRow label="Data policy" value="HIPAA · GDPR · DPDP compliant" />
          <KvRow
            label="Case history export"
            value="Download CSV / PDF"
            borderless
          />
        </Card>

        {/* Account placeholder card (matches screenshot 2 layout) */}
        <Card>
          <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
            Account
          </h2>
          <KvRow label="Payout method" value="Bank · ICICI ··· 4421" />
          <KvRow label="Tax info" value="On file" />
          <KvRow label="Member since" value="March 2023" borderless />
        </Card>
      </div>

      <div className="mt-5">
        <Button
          label="Sign out"
          variant="secondary"
          fullWidth
          size="lg"
          onClick={handleLogout}
        />
      </div>
    </AppLayout>
  );
};
