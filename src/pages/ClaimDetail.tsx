import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { SeverityBadge } from '@/components/SeverityBadge';
import { MetricCard } from '@/components/MetricCard';
import { Icon, type IconName } from '@/components/Icon';
import { EcgWaveform } from '@/components/Waveform';
import { useClaim } from '@/hooks/useClaim';
import { formatRelativeMinutes, cn } from '@/utils/format';

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
  const { caseItem, timeline, patientContext, physiology } = useClaim(caseId);

  if (!caseItem || !patientContext || !physiology) {
    return <AppLayout>{null}</AppLayout>;
  }

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
        <div className="mb-4 flex items-center">
          <SeverityBadge severity={caseItem.severity} />
          <span className="ml-3 text-[13px] tracking-[0.4px] text-[var(--color-text-tertiary)]">
            {caseItem.caseId}
          </span>
          <span className="ml-2 text-[13px] text-[var(--color-text-tertiary)]">
            · {formatRelativeMinutes(caseItem.ageMinutes + 3)}
          </span>
        </div>

        <h1 className="mb-2 text-[26px] font-bold leading-[34px] text-[var(--color-text-primary)]">
          {caseItem.anomaly}
        </h1>
        <p className="mb-4 text-[14px] text-[var(--color-text-tertiary)]">
          {caseItem.patientSex} · {caseItem.patientAge}y · Patient{' '}
          {caseItem.patientId} · Signal {caseItem.signalQ}
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
            onClick={() => navigate(`/trace/${caseItem.id}`)}
          />
        </div>

        <div className="mb-3 flex gap-3">
          <MetricCard
            label="HEART RATE"
            value={caseItem.hr}
            unit="bpm"
            icon="heart"
            large
          />
          <MetricCard
            label="SPO"
            subscript="₂"
            value={caseItem.spo2}
            unit="%"
            icon="drop"
            large
          />
        </div>
        <div className="flex gap-3">
          <MetricCard
            label="HRV"
            value={caseItem.hrv ?? 24}
            unit="ms"
            icon="trace"
            large
          />
          <MetricCard
            label="AI CONFIDENCE"
            value={caseItem.confidence - 7}
            unit="%"
            icon="sparkle"
            large
          />
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
            onClick={() => navigate(`/trace/${caseItem.id}`)}
            className="text-[13px] font-bold text-[var(--color-primary)] transition hover:opacity-70"
          >
            Inspect in TraceView →
          </button>
        </div>
        <EcgWaveform
          severity={
            caseItem.severity === 'CRITICAL'
              ? 'critical'
              : caseItem.severity === 'URGENT'
                ? 'urgent'
                : 'normal'
          }
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

      {/* Timeline */}
      <Card className="mb-5">
        <h2 className="mb-4 text-[22px] font-bold text-[var(--color-text-primary)]">
          History timeline
        </h2>
        <div className="mt-3">
          {timeline.map((t, i) => (
            <TimelineItem
              key={t.when}
              when={t.when}
              description={t.description}
              isFirst={i === 0}
              isLast={i === timeline.length - 1}
            />
          ))}
        </div>
      </Card>

      {/* Patient context */}
      <Card className="mb-5">
        <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
          Patient context
        </h2>
        <div className="mt-3">
          <Row
            label="Sex / Age"
            value={`${patientContext.sex} · ${patientContext.age}y`}
          />
          <Row label="Comorbidities" value={patientContext.comorbidities} />
          <Row label="Adherence" value={`${patientContext.adherencePct}%`} />
          <Row label="Activity" value={patientContext.activity} />
          <Row label="Sleep" value={patientContext.sleep} />
          <Row label="Diet pattern" value={patientContext.dietPattern} />
          <Row
            label="Smoking / Alcohol"
            value={patientContext.smokingAlcohol}
            last
          />
        </div>
      </Card>

      {/* Physiology snapshot */}
      <Card className="mb-5">
        <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
          Physiology snapshot
        </h2>
        <PhysRow
          label="Pulse"
          baseline={`vs ${physiology.pulse.baseline} baseline`}
          value={String(physiology.pulse.value)}
        />
        <PhysRow
          label="HRV"
          baseline={`vs ${physiology.hrv.baseline} baseline`}
          value={`${physiology.hrv.value}${physiology.hrv.unit}`}
        />
        <PhysRow
          label="SpO₂"
          baseline={`vs ${physiology.spo2.baseline}% baseline`}
          value={`${physiology.spo2.value}%`}
        />
        <PhysRow
          label="Recovery"
          baseline={physiology.recoveryNote}
          value={physiology.recovery}
          last
        />
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

const PhysRow = ({
  label,
  baseline,
  value,
  last,
}: {
  label: string;
  baseline: string;
  value: string;
  last?: boolean;
}) => (
  <>
    <div className="flex items-center py-3">
      <div className="flex-1">
        <p className="mb-0.5 text-[15px] font-semibold text-[var(--color-text-primary)]">
          {label}
        </p>
        <p className="text-[13px] text-[var(--color-text-tertiary)]">
          {baseline}
        </p>
      </div>
      <span className="text-[22px] font-bold text-[var(--color-text-primary)]">
        {value}
      </span>
    </div>
    {!last && <div className="h-px bg-[var(--color-divider)]" />}
  </>
);
