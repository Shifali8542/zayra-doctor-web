import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { MetricCard } from '@/components/MetricCard';
import { Icon, type IconName } from '@/components/Icon';
import { EcgWaveform } from '@/components/Waveform';
import { useClaim } from '@/hooks/useClaim';
import { cn } from '@/utils/format';

const Row = ({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) => (
  <div
    className={cn(
      'flex items-start py-3',
      !last && 'border-b border-[var(--color-divider)]',
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

const TimelineItem = ({
  when,
  description,
  isFirst,
  isLast,
}: {
  when: string;
  description: string;
  isFirst?: boolean;
  isLast?: boolean;
}) => (
  <div className="flex items-stretch">
    <div className="flex w-5 flex-col items-center">
      {!isFirst && <div className="h-3 w-px bg-[var(--color-divider)]" />}
      <div className="my-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
      {!isLast && <div className="w-px flex-1 bg-[var(--color-divider)]" />}
    </div>
    <div className="ml-3 mb-4 flex-1">
      <p
        className="eyebrow mb-0.5 text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]"
      >
        {when}
      </p>
      <p className="text-[14px] leading-[22px] text-[var(--color-text-primary)]">
        {description}
      </p>
    </div>
  </div>
);

const ActionPathButton = ({
  icon,
  label,
  onClick,
}: {
  icon: IconName;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="mb-3 flex w-full items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4 text-left transition hover:bg-white/15"
  >
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
      <Icon name={icon} size={18} color="#FFFFFF" strokeWidth={1.8} />
    </div>
    <span className="flex-1 text-[15px] font-semibold text-white">{label}</span>
    <Icon name="arrow-up-right" size={16} color="#FFFFFF" strokeWidth={1.8} />
  </button>
);

export const ClaimDetailPage = () => {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();
  const patientId = caseId ? Number(caseId) : undefined;
  const { patient, clinicalInfo, records, isLoading } = useClaim(patientId);

  if (isLoading) return <AppLayout><p className="py-10 text-center text-[var(--color-text-tertiary)]">Loading…</p></AppLayout>;
  if (!patient) return <AppLayout><p className="py-10 text-center text-[var(--color-text-tertiary)]">Patient not found.</p></AppLayout>;

  const p = patient as { id: number; patient_code: string; age: number; sex: string; diagnosis: string; diagnoses: string[]; dataset_source_display: string };

  return (
    <AppLayout>
      {/* Back row */}
      <button
        onClick={() => navigate(-1)}
        className="mb-2 inline-flex items-center gap-2 py-3 text-[14px] font-medium text-[var(--color-text-primary)] transition hover:opacity-70"
      >
        <Icon name="chevron-left" size={20} color="var(--color-text-primary)" />
        Back to PulseDesk
      </button>

      {/* Case header card */}
      <Card className="mb-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-pill bg-[var(--color-bg-alt)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-secondary)]">
            {p.dataset_source_display}
          </span>
          <span className="text-[13px] text-[var(--color-text-tertiary)]">{p.patient_code}</span>
        </div>

        <h1 className="mb-2 text-[26px] font-bold leading-[34px] text-[var(--color-text-primary)]">
          {p.diagnoses?.[0] ?? p.diagnosis ?? 'ECG Patient'}
        </h1>
        <p className="mb-4 text-[14px] text-[var(--color-text-tertiary)]">
          {p.sex} · {p.age}y · Patient {p.patient_code}
        </p>

        <div className="mb-4 flex flex-wrap gap-3">
          <Button
            label="Ask Alyna"
            variant="secondary"
            iconLeft="sparkle"
            size="md"
            onClick={() => navigate('/alyna')}
          />
          <Button
            label="Open TraceView"
            iconLeft="trace"
            size="md"
            onClick={() => navigate(`/trace/${p.id}`)}
          />
        </div>

        <div className="mb-3 flex gap-3">
          <MetricCard label="AGE" value={p.age} unit="yrs" icon="heart" large />
          <MetricCard label="SEX" value={p.sex} unit="" icon="drop" large />
        </div>
        <div className="flex gap-3">
          <MetricCard label="ECG RECORDS" value={(records as unknown[]).length} unit="" icon="trace" large />
        </div>
      </Card>

      {/* Anomaly waveform */}
      <Card className="mb-5">
        <div className="flex items-start">
          <div className="flex-1">
            <h2 className="mb-1 text-[22px] font-bold text-[var(--color-text-primary)]">
              Anomaly waveform
            </h2>
            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              Live capture · last 30 seconds
            </p>
          </div>
          <button
            onClick={() => navigate(`/trace/${p.id}`)}
            className="text-[13px] font-bold text-[var(--color-primary)] transition hover:opacity-70"
          >
            Inspect in TraceView →
          </button>
        </div>
        <EcgWaveform
          severity="urgent"
          height={160}
          seed={43}
          className="mt-4"
        />
        <div className="mt-3 flex flex-wrap justify-between gap-2">
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            14:42:08 → 14:42:38 · IST
          </span>
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            Lead II · 25mm/s · 10mm/mV
          </span>
        </div>
      </Card>

      {/* Alyna summary */}
      <Card className="mb-5">
        <h2 className="text-[22px] font-bold text-[var(--color-text-primary)]">
          Alyna summary
        </h2>
        <p className="mt-1 text-[13px] text-[var(--color-text-tertiary)]">
          Governed AI assessment
        </p>
        <p className="mb-4 mt-3 text-[14px] leading-[22px] text-[var(--color-text-primary)]">
          Irregularly irregular rhythm, no P-waves. Patient at rest per
          accelerometer. No prior AF. Pattern is{' '}
          <strong className="font-bold">
            significantly outside personal baseline
          </strong>{' '}
          over the past 30 days. Concurrent SpO₂ drop and reduced HRV
          corroborate physiologic stress. Recommend immediate clinician review
          and consideration of escalation.
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag
            label="Off-baseline · 4.2σ"
            leftIcon={
              <Icon
                name="alert-triangle"
                size={13}
                color="var(--color-text-primary)"
              />
            }
          />
          <Tag label="Corroborated by SpO₂ ↓" />
          <Tag label="No prior event in 30d" />
          <Tag label="Patient inactive at onset" />
        </div>
      </Card>

      {/* Diagnoses */}
      <Card className="mb-5">
        <h2 className="mb-4 text-[22px] font-bold text-[var(--color-text-primary)]">Diagnoses</h2>
        <div className="mt-3">
          {(p.diagnoses?.length > 0 ? p.diagnoses : [p.diagnosis ?? '—']).map((d: string, i: number) => (
            <Row key={i} label={`Condition ${i + 1}`} value={d} last={i === (p.diagnoses?.length ?? 1) - 1} />
          ))}
        </div>
      </Card>

      {/* ECG Records */}
      <Card className="mb-5">
        <h2 className="mb-4 text-[22px] font-bold text-[var(--color-text-primary)]">ECG Records</h2>
        {(records as Array<{ id: number; record_name: string; sampling_rate: number; num_channels: number; duration_seconds: number }>).map((r, i) => (
          <Row key={r.id} label={r.record_name} value={`${r.num_channels}ch · ${r.duration_seconds?.toFixed(1)}s · ${r.sampling_rate}Hz`} last={i === records.length - 1} />
        ))}
        {records.length === 0 && <p className="text-[14px] text-[var(--color-text-tertiary)]">No records found.</p>}
      </Card>

      {/* ActionPath */}
      <div className="hero-gradient mb-5 mt-3 rounded-2xl p-6">
        <p
          className="eyebrow mb-3 text-white/80"
          style={{ letterSpacing: '1.4px' }}
        >
          ACTIONPATH
        </p>
        <h2 className="mb-4 text-[22px] font-bold text-white">
          Make a decision
        </h2>

        <ActionPathButton
          icon="phone"
          label="Escalate to emergency response"
        />
        <ActionPathButton
          icon="stethoscope"
          label="Connect to cardiologist on-call"
        />
        <ActionPathButton icon="eye" label="Continue high observation" />
        <ActionPathButton icon="check-circle" label="Continue monitoring" />
        <ActionPathButton
          icon="close-circle"
          label="Mark as false positive"
        />
      </div>
    </AppLayout>
  );
};
