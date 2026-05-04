export type Severity = 'CRITICAL' | 'URGENT' | 'ROUTINE';

export type CaseStatus = 'live' | 'claimed' | 'completed';

export interface CaseMetric {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
}

export interface Case {
  id: string;
  caseId: string; // e.g. ZC-48217
  severity: Severity;
  anomaly: string;
  patientSex: 'M' | 'F';
  patientAge: number;
  patientId: string; // e.g. P-A1842
  hr: number;
  hrDelta?: number;
  spo2: number;
  confidence: number;
  signalQ: string; // e.g. Q92
  viewing: number;
  ageMinutes: number; // minutes since detection
  status: CaseStatus;
  hrv?: number;
}

export interface DoctorStats {
  avgResponseSec: number;
  todayEarningsUsd: number;
  confidencePct: number;
  streakDays: number;
}

export interface TimelineEvent {
  when: string; // 'NOW', '-6H', '-2D', '-9D'
  description: string;
}

export interface AlynaMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  confidence?: number;
  tags?: string[];
}

export interface PatientContext {
  sex: 'M' | 'F';
  age: number;
  comorbidities: string;
  adherencePct: number;
  activity: string;
  sleep: string;
  dietPattern: string;
  smokingAlcohol: string;
}

export interface PhysiologySnapshot {
  pulse: { value: number; baseline: number };
  hrv: { value: number; baseline: number; unit: string };
  spo2: { value: number; baseline: number };
  recovery: 'Low' | 'Moderate' | 'High';
  recoveryNote: string;
}

export interface ImpactStats {
  rankPct: number;
  totalDoctors: number;
  reviewed: number;
  escalations: number;
  avgResponseSec: number;
  streakDays: number;
  decisionConfidence: number;
  reliability: number;
}

export interface LifesavingMoment {
  when: string;
  description: string;
}

export interface DoctorProfile {
  name: string;
  initials: string;
  specialty: string;
  experienceYears: number;
  city: string;
  licenseVerified: boolean;
  languages: string[];
  available: boolean;
  emergencyOnly: boolean;
  workingHours: string;
  severityFilters: string;
}

export interface AnomalyDetails {
  rate: number;
  qrsWidth: number;
  qt: number;
  qtc: number;
  axis: number;
  bookmarks: { label: string; offset: string }[];
}

// =============================================================================
// AUTH
// =============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}


// THEME
export type ThemeMode = 'light' | 'dark';

// ECG ATLAS
export type AtlasDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface AtlasCase {
  id: string;
  title: string;
  description?: string;
  category: string;
  durationMin: number;
  difficulty: AtlasDifficulty;
  patientMeta: string;       // e.g. "Anonymized · 58F · ambulatory · lead V2"
  tags: string[];            // e.g. ['STEMI', 'POSTERIOR', '4 MIN', 'INTERMEDIATE']
  isFeatured?: boolean;
}

export interface AtlasStats {
  accuracyPct: number;
  solved: number;
}

// =============================================================================
// GRAND ROUNDS
// =============================================================================

export interface GrandRoundsThread {
  id: string;
  authorName: string;
  authorInitials: string;
  authorSpecialty: string;
  postedRelative: string;    // e.g. "3h", "9h", "1d"
  title: string;
  replies: number;
  saved: number;
}

// =============================================================================
// EARNINGS
// =============================================================================

export type EarningsSeverityKey = 'critical' | 'urgent' | 'routine' | 'info';

export interface EarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  pendingPayout: number;
  nextSettlementLabel: string; // e.g. "Settlement on Friday"
}

export interface EarningsBySeverity {
  key: EarningsSeverityKey;
  label: string;
  amount: number;
  // 0..1 fill (amount / max in the set)
  fillPct: number;
}

export type EarningsStatus = 'Settled' | 'Pending' | 'Processing';

export interface EarningsReviewRow {
  caseId: string;
  severity: 'Critical' | 'Urgent' | 'Routine' | 'Info';
  timeLabel: string; 
  status: EarningsStatus;
  payoutUsd: number;
}