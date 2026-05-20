export type Severity = 'CRITICAL' | 'URGENT' | 'ROUTINE';

export type CaseStatus = 'live' | 'claimed' | 'completed' | 'missed' | 'escalated';

export type CaseSeverity = 'normal' | 'routine' | 'urgent' | 'critical';

// Matches exact backend CaseReview serializer fields
export interface CaseReview {
  id: number;
  status: CaseStatus;
  severity: CaseSeverity;
  patient_code: string;
  age: number | null;
  sex: string | null;
  diagnosis: string | null;
  display_diagnosis: string;
  diagnosis_class: 'normal' | 'mi' | 'mimic' | 'other' | null;
  dataset_source: string;
  dataset_source_display: string;
  record_name: string;
  heart_rate_bpm: number | null;
  hrv_ms: number | null;
  confidence_score: number | null;
  notes: string | null;
  doctor_name: string | null;
  created_at: string;
  claimed_at: string | null;
  completed_at: string | null;
}

export interface CaseReviewListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CaseReview[];
}

// Matches GET /cases/:id/detail/ response exactly
export interface CaseVitals {
  heart_rate_bpm: number | null;
  heart_rate_min: number | null;
  heart_rate_max: number | null;
  hrv_ms: number | null;
  rhythm: string | null;
  quality_score: number | null;
  num_beats: number | null;
}

export interface CaseEcgRecord {
  id: number;
  record_name: string;
  sampling_rate: number;
  num_channels: number;
  duration_seconds: number | null;
  channel_names: string[];
  is_current: boolean;
}

export interface CaseHistoryEvent {
  when: string | null;
  status: CaseStatus;
  description: string;
  doctor_name: string | null;
}

export interface CaseOrinnAnalysis {
  risk_level: string;
  risk_score: number | null;
  narrative: string | null;
  recommendation: string | null;
  findings: string[];
  differential: string[];
  source: string;
}

export interface CaseStAnalysis {
  overall_status: string;
  stemi_suspected: boolean;
  affected_region: string;
  confidence_score: number;
  overall_status_note: string;
}

export interface CasePatientDetail {
  id: number;
  patient_code: string;
  age: number | null;
  sex: string | null;
  diagnosis: string | null;
  display_diagnosis: string;
  all_diagnoses: string[];
  diagnosis_class: string | null;
  dataset_source: string;
  dataset_source_display: string;
  extra_info: Record<string, unknown>;
}

// Matches GET /api/v1/impact/stats/ response
export interface ImpactStats {
  doctor: {
    id: number;
    name: string;
    specialization: string | null;
    hospital_name: string | null;
  };
  reviewed_count: number;
  escalated_count: number;
  claimed_count: number;
  avg_response_sec: number | null;
  streak_days: number;
  confidence_score: number | null;
  reliability_pct: number | null;
  trust_score: number | null;
  rank_pct: number;
  total_doctors: number;
}

// Matches GET /api/v1/impact/moments/ response
export interface ImpactMoment {
  id: number;
  when: string | null;
  description: string;
  patient_code: string;
  severity: CaseSeverity;
  diagnosis: string | null;
}

export interface ImpactMomentsResponse {
  count: number;
  moments: ImpactMoment[];
}

export interface CaseDetail {
  case: {
    id: number;
    status: CaseStatus;
    severity: CaseSeverity;
    heart_rate_bpm: number | null;
    hrv_ms: number | null;
    confidence_score: number | null;
    notes: string | null;
    doctor_name: string | null;
    created_at: string;
    claimed_at: string | null;
    completed_at: string | null;
  };
  patient: CasePatientDetail;
  vitals: CaseVitals;
  records: CaseEcgRecord[];
  orinn: CaseOrinnAnalysis | null;
  st_analysis: CaseStAnalysis | null;
  history: CaseHistoryEvent[];
}

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

// AUTH

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: 'admin' | 'doctor' | 'nurse' | 'patient';
  created_at: string;
  specialization: string | null;
  license_number: string | null;
  hospital_name: string | null;
  years_of_experience: number | null;
  qualification: string | null;
  is_doctor: boolean;
  is_patient: boolean;
  patient_count?: number;
  ecg_record_count?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  confirm_password: string;
  specialization?: string;
  license_number?: string;
  hospital_name?: string;
  years_of_experience?: number;
  qualification?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
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
  nextSettlementLabel: string;
}

export interface EarningsBySeverity {
  key: EarningsSeverityKey;
  label: string;
  amount: number;
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

// WAVEFORM
export interface WaveformGrid {
  paper_speed_mm_per_sec: number;
  amplitude_mm_per_mv: number;
  small_box_ms: number;
  large_box_ms: number;
  small_box_mv: number;
  large_box_mv: number;
}

export interface WaveformSegment {
  samples: number[];
  start_sec: number;
  end_sec: number;
}

export interface WaveformSegments {
  before: WaveformSegment;
  anomaly: WaveformSegment;
  after: WaveformSegment;
}

/**
 * Exact response from GET /patients/:id/waveform/
 * waveforms is a dict keyed by channel name e.g. { "II": [0.1, 0.2, ...] }
 */
export interface PatientWaveformResponse {
  patient_code: string;
  record_id: number;
  record_name: string;
  record_index: number;
  total_records: number;
  diagnosis: string | null;
  dataset_source: string | null;
  dataset_source_display: string | null;
  age: number | null;
  sex: string | null;
  sampling_rate: number;
  effective_sampling_rate: number;
  num_samples: number;
  duration_seconds: number | null;
  channel_names: string[];
  units: string[];
  waveforms: Record<string, number[]>;        // { "II": [...], "V1": [...] }
  segments: Partial<WaveformSegments>;         // before / anomaly / after
  grid: WaveformGrid;
  recommended_display_seconds: number;
}

/** Records index — lightweight list, no S3 */
export interface RecordsIndexRecord {
  id: number;
  record_index: number;
  record_name: string;
  label: string;
  duration_seconds: number | null;
  sampling_rate: number | null;
  num_channels: number | null;
  channel_names: string[];
}

export interface RecordsIndexResponse {
  patient_id: number;
  patient_code: string;
  dataset_source: string | null;
  dataset_source_display: string | null;
  total_records: number;
  records: RecordsIndexRecord[];
}

/**
 * Waveform analysis response from GET /patients/:id/waveform-analysis/
 */
export interface WaveformAnalysisResponse {
  patient_id?: number;
  record_name?: string;
  heart_rate_bpm: number | null;
  hrv_ms: number | null;
  rhythm: string | null;
  quality_score: number | null;
  num_beats: number | null;
}