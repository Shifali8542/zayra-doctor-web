/**
 * Single source of mock data for the app.
 * When real APIs are wired up, replace usage in `src/services/api.ts`.
 */

import type {
  Case,
  DoctorStats,
  TimelineEvent,
  AlynaMessage,
  PatientContext,
  PhysiologySnapshot,
  ImpactStats,
  LifesavingMoment,
  DoctorProfile,
  AnomalyDetails,
} from '@/types';

export const mockDoctorStats: DoctorStats = {
  avgResponseSec: 38,
  todayEarningsUsd: 184,
  confidencePct: 94,
  streakDays: 23,
};

export const mockLiveCases: Case[] = [
  {
    id: 'c1',
    caseId: 'ZC-48217',
    severity: 'CRITICAL',
    anomaly: 'Sustained ventricular tachycardia',
    patientSex: 'M',
    patientAge: 67,
    patientId: 'P-A1842',
    hr: 178,
    hrDelta: 94,
    spo2: 91,
    confidence: 96,
    signalQ: 'Q92',
    viewing: 3,
    ageMinutes: 0.4,
    status: 'live',
  },
  {
    id: 'c2',
    caseId: 'ZC-48216',
    severity: 'URGENT',
    anomaly: 'Atrial fibrillation, new-onset',
    patientSex: 'F',
    patientAge: 54,
    patientId: 'P-K2210',
    hr: 138,
    hrDelta: 52,
    spo2: 96,
    confidence: 89,
    signalQ: 'Q88',
    viewing: 6,
    ageMinutes: 2,
    status: 'live',
    hrv: 24,
  },
  {
    id: 'c3',
    caseId: 'ZC-48215',
    severity: 'URGENT',
    anomaly: 'Supraventricular tachycardia',
    patientSex: 'M',
    patientAge: 48,
    patientId: 'P-S0291',
    hr: 162,
    hrDelta: 78,
    spo2: 95,
    confidence: 84,
    signalQ: 'Q87',
    viewing: 4,
    ageMinutes: 5,
    status: 'live',
  },
  {
    id: 'c4',
    caseId: 'ZC-48214',
    severity: 'ROUTINE',
    anomaly: 'PVC burden elevated (18%)',
    patientSex: 'F',
    patientAge: 41,
    patientId: 'P-M3380',
    hr: 88,
    hrDelta: 12,
    spo2: 98,
    confidence: 76,
    signalQ: 'Q95',
    viewing: 12,
    ageMinutes: 7,
    status: 'live',
  },
  {
    id: 'c5',
    caseId: 'ZC-48213',
    severity: 'URGENT',
    anomaly: 'Bradycardia with pause',
    patientSex: 'M',
    patientAge: 59,
    patientId: 'P-T1142',
    hr: 38,
    hrDelta: -22,
    spo2: 94,
    confidence: 91,
    signalQ: 'Q90',
    viewing: 14,
    ageMinutes: 11,
    status: 'live',
  },
];

export const mockClaimedCases: Case[] = [
  {
    id: 'cl1',
    caseId: 'ZC-48190',
    severity: 'URGENT',
    anomaly: 'Atrial fibrillation, new-onset',
    patientSex: 'F',
    patientAge: 54,
    patientId: 'P-K2210',
    hr: 138,
    hrDelta: 52,
    spo2: 96,
    confidence: 89,
    signalQ: 'Q88',
    viewing: 6,
    ageMinutes: 32,
    status: 'claimed',
  },
];

export const mockCompletedCases: Case[] = [
  {
    id: 'co1',
    caseId: 'ZC-48155',
    severity: 'CRITICAL',
    anomaly: 'Sustained ventricular tachycardia',
    patientSex: 'M',
    patientAge: 67,
    patientId: 'P-A1842',
    hr: 178,
    spo2: 91,
    confidence: 96,
    signalQ: 'Q92',
    viewing: 0,
    ageMinutes: 240,
    status: 'completed',
  },
  {
    id: 'co2',
    caseId: 'ZC-48149',
    severity: 'ROUTINE',
    anomaly: 'PVC burden elevated (18%)',
    patientSex: 'F',
    patientAge: 41,
    patientId: 'P-M3380',
    hr: 88,
    spo2: 98,
    confidence: 76,
    signalQ: 'Q95',
    viewing: 0,
    ageMinutes: 360,
    status: 'completed',
  },
];

export const mockTimeline: TimelineEvent[] = [
  { when: 'NOW', description: 'Anomaly detected — VT pattern, 96% confidence' },
  { when: '-6H', description: 'Sleep-phase HRV reduction noted' },
  { when: '-2D', description: 'Routine review, no escalation (Dr. K. Mehta)' },
  { when: '-9D', description: 'Baseline ambulatory ECG, normal sinus' },
];

export const mockAlynaConversation: AlynaMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    text: "I'm Alyna. I have full context on case ZC-48217. Ask me anything about the rhythm, the patient timeline, or what changed from baseline.",
    confidence: 96,
  },
  {
    id: 'm2',
    role: 'user',
    text: 'Has this happened before in the past 30 days?',
  },
  {
    id: 'm3',
    role: 'assistant',
    text: "No prior wide-complex tachycardia events were captured in this patient's 30-day window. There is one episode of brief PVC clustering 9 days ago (T+0:43, 6 beats) which resolved spontaneously.",
    confidence: 92,
    tags: ['30-day rhythm log', 'PVC cluster — 9d ago', 'Baseline normal sinus'],
  },
];

export const mockAlynaSuggestions: string[] = [
  'What changed from baseline?',
  'Did SpO₂ shift with the ECG event?',
  'Was the patient resting or active?',
  'How urgent is this pattern?',
  'Show me the last 24 hours',
];

export const mockPatientContext: PatientContext = {
  sex: 'F',
  age: 54,
  comorbidities: 'HTN, T2DM (controlled)',
  adherencePct: 92,
  activity: 'Sedentary, 4.2k steps/day',
  sleep: '6h 12m avg · efficiency 78%',
  dietPattern: 'Moderate sodium, low fiber',
  smokingAlcohol: 'Never · Occasional',
};

export const mockPhysiology: PhysiologySnapshot = {
  pulse: { value: 138, baseline: 84 },
  hrv: { value: 24, baseline: 48, unit: 'ms' },
  spo2: { value: 96, baseline: 97 },
  recovery: 'Low',
  recoveryNote: 'elevated 36h',
};

export const mockImpact: ImpactStats = {
  rankPct: 7,
  totalDoctors: 12400,
  reviewed: 1284,
  escalations: 162,
  avgResponseSec: 38,
  streakDays: 23,
  decisionConfidence: 94,
  reliability: 99,
};

export const mockLifesavingMoments: LifesavingMoment[] = [
  {
    when: 'TODAY, 14:42',
    description: 'Escalated VT in 67M — patient stabilized in ER',
  },
  {
    when: 'YESTERDAY',
    description: 'Caught silent ischemia, referred to cath lab',
  },
  {
    when: '3 DAYS AGO',
    description: 'Pacemaker referral after Mobitz II detection',
  },
];

export const mockDoctorProfile: DoctorProfile = {
  name: 'Dr. Sanjana Rao',
  initials: 'SR',
  specialty: 'Cardiac Electrophysiology',
  experienceYears: 14,
  city: 'Bengaluru',
  licenseVerified: true,
  languages: ['English', 'Hindi', 'Kannada'],
  available: true,
  emergencyOnly: false,
  workingHours: 'Mon–Sat · 08:00 – 22:00',
  severityFilters: 'Critical · Urgent · Routine',
};

export const mockAnomalyDetails: AnomalyDetails = {
  rate: 178,
  qrsWidth: 148,
  qt: 312,
  qtc: 482,
  axis: -42,
  bookmarks: [
    { label: 'Onset', offset: 'T+0s' },
    { label: 'Peak', offset: 'T+12s' },
    { label: 'Resolution', offset: 'T+42s' },
  ],
};

// =============================================================================
// ECG ATLAS
// =============================================================================

import type {
  AtlasCase,
  AtlasStats,
  GrandRoundsThread,
  EarningsSummary,
  EarningsBySeverity,
  EarningsReviewRow,
} from '@/types';

export const mockAtlasStats: AtlasStats = {
  accuracyPct: 84,
  solved: 142,
};

export const mockAtlasFeatured: AtlasCase = {
  id: 'atlas-featured',
  title: 'Subtle posterior STEMI in lead V2',
  description:
    'Reciprocal changes seen as ST depression and tall R-waves in V1–V3. Walk through the diagnostic reasoning with 4 expert annotations.',
  category: 'STEMI',
  durationMin: 4,
  difficulty: 'INTERMEDIATE',
  patientMeta: 'Anonymized · 58F · ambulatory · lead V2',
  tags: ['STEMI', 'POSTERIOR', '4 MIN', 'INTERMEDIATE'],
  isFeatured: true,
};

export const mockAtlasContinue: AtlasCase[] = [
  {
    id: 'atlas-1',
    title: 'Wide-complex tachycardia: VT vs SVT-aberrant',
    category: 'VT',
    durationMin: 6,
    difficulty: 'ADVANCED',
    patientMeta: 'Anonymized · 64M · monitored · 12-lead',
    tags: ['VT', 'WIDE-COMPLEX', '6 MIN', 'ADVANCED'],
  },
  {
    id: 'atlas-2',
    title: 'Subtle posterior STEMI in lead V2',
    category: 'STEMI',
    durationMin: 4,
    difficulty: 'INTERMEDIATE',
    patientMeta: 'Anonymized · 58F · ambulatory · lead V2',
    tags: ['STEMI', '4 MIN', 'INTERMEDIATE'],
  },
  {
    id: 'atlas-3',
    title: 'Mobitz II with 2:1 conduction',
    category: 'AV BLOCK',
    durationMin: 5,
    difficulty: 'ADVANCED',
    patientMeta: 'Anonymized · 71M · ambulatory · lead II',
    tags: ['AV BLOCK', '5 MIN', 'ADVANCED'],
  },
];

// =============================================================================
// GRAND ROUNDS
// =============================================================================

export const mockGrandRoundsThreads: GrandRoundsThread[] = [
  {
    id: 'gr-1',
    authorName: 'Dr. A. Subramaniam',
    authorInitials: 'SU',
    authorSpecialty: 'Cardiac Electrophysiology',
    postedRelative: '3h',
    title: 'Repolarization heterogeneity preceding torsades — a 4-case series',
    replies: 38,
    saved: 142,
  },
  {
    id: 'gr-2',
    authorName: 'Dr. L. Okafor',
    authorInitials: 'OK',
    authorSpecialty: 'Interventional Cardiology',
    postedRelative: '9h',
    title: 'AI-flagged silent ischemia: should the threshold be tighter?',
    replies: 24,
    saved: 87,
  },
  {
    id: 'gr-3',
    authorName: 'Dr. M. Chen',
    authorInitials: 'CH',
    authorSpecialty: 'Heart Failure',
    postedRelative: '1d',
    title: 'Sleep-onset bradyarrhythmia patterns in HFpEF',
    replies: 17,
    saved: 64,
  },
];

// =============================================================================
// EARNINGS
// =============================================================================

export const mockEarningsSummary: EarningsSummary = {
  today: 184,
  thisWeek: 1240,
  thisMonth: 5320,
  pendingPayout: 412,
  nextSettlementLabel: 'Settlement on Friday',
};

const _bySev: { key: EarningsBySeverity['key']; label: string; amount: number }[] = [
  { key: 'critical', label: 'Critical', amount: 720 },
  { key: 'urgent', label: 'Urgent', amount: 1840 },
  { key: 'routine', label: 'Routine', amount: 1980 },
  { key: 'info', label: 'Info', amount: 780 },
];
const _maxSev = Math.max(..._bySev.map((s) => s.amount));

export const mockEarningsBySeverity: EarningsBySeverity[] = _bySev.map((s) => ({
  ...s,
  fillPct: s.amount / _maxSev,
}));

export const mockEarningsReviews: EarningsReviewRow[] = [
  {
    caseId: 'ZC-48155',
    severity: 'Critical',
    timeLabel: '1m 24s',
    status: 'Settled',
    payoutUsd: 64,
  },
  {
    caseId: 'ZC-48149',
    severity: 'Routine',
    timeLabel: '0m 52s',
    status: 'Settled',
    payoutUsd: 18,
  },
  {
    caseId: 'ZC-48141',
    severity: 'Urgent',
    timeLabel: '1m 06s',
    status: 'Pending',
    payoutUsd: 32,
  },
  {
    caseId: 'ZC-48136',
    severity: 'Critical',
    timeLabel: '0m 48s',
    status: 'Settled',
    payoutUsd: 64,
  },
];