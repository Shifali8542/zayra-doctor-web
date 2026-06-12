export type Severity = 'CRITICAL' | 'URGENT' | 'ROUTINE';
export type CaseStatus = 'live' | 'claimed' | 'completed' | 'missed' | 'escalated';
export type CaseSeverity = 'normal' | 'routine' | 'urgent' | 'critical';

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

export interface AlynaMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  confidence?: number;
  tags?: string[];
  suggestions?: string[];
}

export interface AlynaChatResponse {
  reply:       string;
  suggestions: string[];
  message_id:  number;
}

export interface AlynaHistoryMessage {
  id:          number;
  role:        'user' | 'assistant';
  text:        string;
  suggestions: string[];
  created_at:  string;
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

// EARNINGS — derived from completed CaseReview records
export interface EarningsRow {
  case_id: number;
  patient_code: string;
  severity: CaseSeverity;
  completed_at: string | null;
  notes: string | null;
}

export interface EarningsResponse {
  count: number;
  results: EarningsRow[];
}

// CASE COUNTS 
export interface CaseCounts {
  live: number;
  claimed: number;
  completed: number;
  missed: number;
  escalated: number;
}

// PATIENT ASSIGNMENTS
export type AssignmentSlot = 'critical' | 'urgent' | 'routine' | 'fill';

export interface AssignedPatient {
  patient_id: number;
  patient_code: string;
  priority_slot: AssignmentSlot;
  assigned_at: string;
}

export interface AssignmentsResponse {
  count: number;
  assignments: AssignedPatient[];
}

// WAVEFORMa
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
  all_channel_names: string[];
  units: string[];
  waveforms: Record<string, number[]>;
  segments: Partial<WaveformSegments>;
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

// TraceView case picker summary — lightweight, from case list API
export interface TraceViewCase {
  id: number;
  severity: CaseSeverity;
  status: CaseStatus;
  patient_code: string;
  age: number | null;
  sex: string | null;
  display_diagnosis: string;
  dataset_source_display: string;
  record_name: string;
  heart_rate_bpm: number | null;
  created_at: string;
}
// BLE MI Prediction — from BLEPredictionResult model
export interface BLEMIPrediction {
  id: number;
  mi_detected: boolean;
  confidence: number;
  prob_norm: number;
  prob_mi: number;
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
  recommendation: string;
  model_name: string;
  analysis_time_ms: number | null;
  samples_used: number | null;
  patient_context: Record<string, unknown>;
  created_at: string;
  ecg_record_id: number;
  patient_code: string;
}

export interface BLEMIPredictionListResponse {
  count: number;
  results: BLEMIPrediction[];
}

// WebSocket MI alert pushed from ws/ecg-alerts/
export interface WSMIAlert {
  type: 'mi_alert' | 'connected';
  patient_code?: string;
  patient_id?: number;
  ecg_record_id?: number;
  mi_detected?: boolean;
  confidence?: number;
  severity?: 'NORMAL' | 'WARNING' | 'CRITICAL';
  recommendation?: string;
  probabilities?: { NORM: number; MI: number };
  model_name?: string;
  timestamp?: string;
  message?: string;
}

// WaveformAnalysisResponse
export interface WaveformAnalysisResponse {
  patient_code?: string;
  record_name?: string;
  lead_analyzed?: string;
  sampling_rate?: number;
  heart_rate_bpm: number | null;
  hrv_ms: number | null;
  rhythm: string | null;
  quality_score: number | null;
  num_beats: number | null;
  wave_counts?: {
    P?: number;
    Q?: number;
    R?: number;
    S?: number;
    T?: number;
    error?: string;
  };
 wave_intervals?: {
    pr_interval_ms: number | null;
    qrs_duration_ms: number | null;
    qt_interval_ms: number | null;
    qtc_interval_ms: number | null;
  };
}