/**
 * Centralized API service.
 *
 * Currently returns mock data with simulated network delay.
 * Replace each function body with real fetch/axios calls when integrating
 * with the backend - the function signatures and return types will stay stable.
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
  User,
  LoginCredentials,
  SignupCredentials,
} from '@/types';
import {
  mockDoctorStats,
  mockLiveCases,
  mockClaimedCases,
  mockCompletedCases,
  mockTimeline,
  mockAlynaConversation,
  mockAlynaSuggestions,
  mockPatientContext,
  mockPhysiology,
  mockImpact,
  mockLifesavingMoments,
  mockDoctorProfile,
  mockAnomalyDetails,
} from '@/mocks/mockData';

// =============================================================================
// CONFIG
// =============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const NETWORK_DELAY_MS = 200;

const delay = <T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// =============================================================================
// API ENDPOINTS (string constants reused across the app)
// =============================================================================

export const API_ENDPOINTS = {
  // Auth
  login: '/auth/login',
  signup: '/auth/signup',
  logout: '/auth/logout',
  me: '/auth/me',

  // Cases
  liveCases: '/cases/live',
  claimedCases: '/cases/claimed',
  completedCases: '/cases/completed',
  caseById: (id: string) => `/cases/${id}`,
  claimCase: (id: string) => `/cases/${id}/claim`,

  // Dashboard / stats
  doctorStats: '/dashboard/stats',
  impact: '/impact',
  lifesavingMoments: '/impact/lifesaving',

  // Patient
  patientContext: (id: string) => `/patients/${id}/context`,
  physiology: (id: string) => `/patients/${id}/physiology`,
  timeline: (id: string) => `/patients/${id}/timeline`,

  // Trace
  anomalyDetails: (caseId: string) => `/cases/${caseId}/anomaly`,
  saveAnnotation: (caseId: string) => `/cases/${caseId}/annotation`,

  // Alyna
  alynaConversation: (caseId: string) => `/alyna/conversations/${caseId}`,
  alynaMessage: '/alyna/messages',
  alynaSuggestions: '/alyna/suggestions',

  // Profile
  profile: '/profile',
  profileSettings: '/profile/settings',
} as const;

// =============================================================================
// AUTH API
// =============================================================================

export const authApi = {
  login: async (creds: LoginCredentials): Promise<User> => {
    if (!creds.email || !creds.password) {
      throw new Error('Email and password required');
    }
    return delay({
      id: 'u_1',
      name: mockDoctorProfile.name,
      email: creds.email,
    });
  },

  signup: async (creds: SignupCredentials): Promise<User> => {
    if (!creds.name || !creds.email || !creds.password) {
      throw new Error('All fields required');
    }
    return delay({
      id: 'u_1',
      name: creds.name,
      email: creds.email,
    });
  },

  logout: async (): Promise<void> => delay(undefined),

  me: async (): Promise<User | null> => {
    const stored = localStorage.getItem('zayra_user');
    return delay(stored ? JSON.parse(stored) : null);
  },
};

// =============================================================================
// CASES API
// =============================================================================

export const casesApi = {
  getLive: async (): Promise<Case[]> => delay(mockLiveCases),
  getClaimed: async (): Promise<Case[]> => delay(mockClaimedCases),
  getCompleted: async (): Promise<Case[]> => delay(mockCompletedCases),

  getById: async (id: string): Promise<Case> => {
    const all = [...mockLiveCases, ...mockClaimedCases, ...mockCompletedCases];
    const found = all.find((c) => c.id === id || c.caseId === id);
    if (!found) throw new Error(`Case ${id} not found`);
    return delay(found);
  },

  claim: async (id: string): Promise<Case> => {
    const found = mockLiveCases.find((c) => c.id === id || c.caseId === id);
    if (!found) throw new Error(`Case ${id} not found`);
    return delay({ ...found, status: 'claimed' });
  },
};

// =============================================================================
// DASHBOARD / IMPACT API
// =============================================================================

export const dashboardApi = {
  getStats: async (): Promise<DoctorStats> => delay(mockDoctorStats),
};

export const impactApi = {
  getStats: async (): Promise<ImpactStats> => delay(mockImpact),
  getLifesavingMoments: async (): Promise<LifesavingMoment[]> =>
    delay(mockLifesavingMoments),
};

// =============================================================================
// PATIENT API
// =============================================================================

export const patientApi = {
  getContext: async (_patientId: string): Promise<PatientContext> =>
    delay(mockPatientContext),
  getPhysiology: async (_patientId: string): Promise<PhysiologySnapshot> =>
    delay(mockPhysiology),
  getTimeline: async (_patientId: string): Promise<TimelineEvent[]> =>
    delay(mockTimeline),
};

// =============================================================================
// TRACE API
// =============================================================================

export const traceApi = {
  getAnomalyDetails: async (_caseId: string): Promise<AnomalyDetails> =>
    delay(mockAnomalyDetails),
  saveAnnotation: async (_caseId: string, _text: string): Promise<void> =>
    delay(undefined, 300),
};

// =============================================================================
// ALYNA API
// =============================================================================

export const alynaApi = {
  getConversation: async (_caseId: string): Promise<AlynaMessage[]> =>
    delay(mockAlynaConversation),
  getSuggestions: async (): Promise<string[]> => delay(mockAlynaSuggestions),
  sendMessage: async (_caseId: string, text: string): Promise<AlynaMessage> => {
    return delay(
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text:
          'Based on the latest 30-day signals, the rhythm pattern is significantly outside this patient\'s personal baseline. Recommend immediate clinician review.',
        confidence: 90,
      } as AlynaMessage,
      600,
    );
  },
};

// =============================================================================
// PROFILE API
// =============================================================================

export const profileApi = {
  getProfile: async (): Promise<DoctorProfile> => delay(mockDoctorProfile),
  updateSettings: async (
    settings: Partial<DoctorProfile>,
  ): Promise<DoctorProfile> =>
    delay({ ...mockDoctorProfile, ...settings }),
};
