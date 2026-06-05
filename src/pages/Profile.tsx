import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { ShieldCheck, Moon, Sun, Bell, LogOut } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/format';

const InfoRow = ({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm first:border-0 first:pt-0">
    <span className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      {label}
    </span>
    <span className="font-semibold text-right">{value}</span>
  </div>
);

const CustomToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!value)}
    className={cn(
      "relative h-6 w-11 rounded-full transition-colors shrink-0",
      value ? "bg-[oklch(var(--teal))]" : "bg-muted"
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
        value ? "translate-x-[22px]" : "translate-x-0.5"
      )}
    ></span>
  </button>
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

  const initials = profile ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}` : '?';

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-4xl">
       {/* Header Hero Section */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(32%_0.11_255)_0%,oklch(45%_0.14_220)_50%,oklch(72%_0.15_173)_100%)] p-6 text-white shadow-[0_0_0_1px_oklch(72%_0.15_173/0.15),0_8px_32px_-8px_oklch(72%_0.15_173/0.4)] md:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-white/15 font-display text-3xl font-bold ring-4 ring-white/20">
            {profile?.first_name ? `${profile.first_name[0]}${profile.last_name?.[0] ?? ''}` : 'SR'}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              {profile?.role === 'doctor' ? 'Verified Cardiologist' : (profile?.role ?? 'Verified Cardiologist')}
            </p>
            <h1 className="font-display text-3xl font-bold">
              {profile?.first_name ? `Dr. ${profile.first_name} ${profile.last_name}` : 'Dr. Sanjana Rao'}
            </h1>
            <p className="mt-1 text-sm text-white/85">
              {profile?.specialization || 'Cardiac Electrophysiology'} · {profile?.years_of_experience || '14'} years · {profile?.hospital_name || 'Bengaluru'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-[rgba(255,255,255,0.15)] px-2.5 py-1 backdrop-blur-[8px] text-white">
                <ShieldCheck className="mr-1 inline h-3 w-3" aria-hidden="true" /> {profile?.license_number || 'License verified'}
              </span>
              <span className="rounded-full bg-[rgba(255,255,255,0.15)] px-2.5 py-1 backdrop-blur-[8px] text-white">
                {profile?.qualification || 'English · Hindi · Kannada'}
              </span>
            </div>
          </div>
        </div>
      </section>

        {/* Settings Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Availability */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
            <h2 className="mb-3 font-display font-bold">Availability</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Available for review</p>
                  <p className="text-xs text-muted-foreground">Receive live anomaly alerts</p>
                </div>
                <CustomToggle value={available} onChange={toggleAvailable} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Emergency-only mode</p>
                  <p className="text-xs text-muted-foreground">Only critical-tier cases</p>
                </div>
                <CustomToggle value={emergencyOnly} onChange={toggleEmergency} />
              </div>
              <InfoRow label="Working hours" value="Mon–Sat · 08:00 – 22:00" />
              <InfoRow label="Severity filter" value="Critical · Urgent · Routine" />
              <InfoRow label="License No." value={profile?.license_number ?? '—'} />
              <InfoRow label="Qualification" value={profile?.qualification ?? '—'} />
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
            <h2 className="mb-3 font-display font-bold">Notifications</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Lock-screen medical alerts</p>
                  <p className="text-xs text-muted-foreground">High-priority banner</p>
                </div>
                <CustomToggle value={lockScreenAlerts} onChange={setLockScreenAlerts} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Haptic + sound</p>
                  <p className="text-xs text-muted-foreground">Distinct tone per severity tier</p>
                </div>
                <CustomToggle value={hapticSound} onChange={setHapticSound} />
              </div>
              <InfoRow label="Sound profile" value="Pulse · Soft" />
              <InfoRow label="Quiet hours" value="23:00 – 07:00 (emergency override)" />
            </div>
          </section>

          {/* App preferences */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
            <h2 className="mb-3 font-display font-bold">App preferences</h2>
            <div className="space-y-3">
              <InfoRow 
                icon={mode === 'light' ? <Sun className="h-3.5 w-3.5" aria-hidden="true" /> : <Moon className="h-3.5 w-3.5" aria-hidden="true" />}
                label="Theme" 
                value={<button className="hover:opacity-80 transition" onClick={toggleMode}>{mode === 'light' ? 'Light · matches system' : 'Dark mode'}</button>} 
              />
              <InfoRow label="AI transparency" value="Show evidence cards by default" />
              <InfoRow label="Data policy" value="HIPAA · GDPR · DPDP compliant" />
              <InfoRow label="Case history export" value="Download CSV / PDF" />
            </div>
          </section>

          {/* Account */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
            <h2 className="mb-3 font-display font-bold">Account</h2>
            <div className="space-y-3">
              <InfoRow label="Payout method" value="Bank · ICICI ••• 4421" />
              <InfoRow label="Tax info" value="On file" />
              <InfoRow 
                icon={<Bell className="h-3.5 w-3.5" aria-hidden="true" />} 
                label="Support" 
                value="support@zayra.health" 
              />
              <button onClick={handleLogout} className="mt-2 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-[oklch(var(--severity-critical))] hover:bg-[oklch(var(--severity-critical)/0.1)]">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </div>
          </section>

        </div>
      </div>
    </AppLayout>
  );
};