import type { User, LoginCredentials, SignupCredentials, CaseStatus, CaseSeverity, CaseReview, CaseReviewListResponse, } from '@/types';

// CONFIG
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://192.168.1.172:8000/api/v1';

const TOKEN_KEY = 'zayra_access';
const REFRESH_KEY = 'zayra_refresh';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? err.message ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// API ENDPOINTS 
export const API_ENDPOINTS = {
  // Auth
  login: '/auth/login/',
  registerDoctor: '/auth/register/doctor/',
  registerPatient: '/auth/register/user/',
  logout: '/auth/logout/',
  profile: '/auth/profile/',
  tokenRefresh: '/auth/token/refresh/',

  // Patients
  patientList: '/patients/',
  patientDetail: (id: number) => `/patients/${id}/`,
  patientRecords: (id: number) => `/patients/${id}/records/`,
  patientWaveform: (id: number) => `/patients/${id}/waveform/`,
  patientClinicalInfo: (id: number) => `/patients/${id}/clinical-info/`,
  patientReport: (id: number) => `/patients/${id}/report/`,
  patientWaveformAnalysis: (id: number) => `/patients/${id}/waveform-analysis/`,
  patientWaveformAnnotations: (id: number) => `/patients/${id}/waveform-annotations/`,
  diagnosisSummary: '/patients/summary/',
  datasetOverview: '/patients/dataset-overview/',

  // Assessments
  aiAnalysis: (id: number) => `/assessments/${id}/analyze/`,

  // Cases lifecycle
  caseList: '/cases/',
  caseDetail: (id: number) => `/cases/${id}/`,
  caseClaim: (id: number) => `/cases/${id}/claim/`,
  caseComplete: (id: number) => `/cases/${id}/complete/`,
  caseEscalate: (id: number) => `/cases/${id}/escalate/`,
} as const;

// AUTH API
export const authApi = {
  login: async (creds: LoginCredentials): Promise<User> => {
    const data = await apiFetch<{ user: User; access: string; refresh: string }>(
      API_ENDPOINTS.login,
      { method: 'POST', body: JSON.stringify(creds) },
    );
    setTokens(data.access, data.refresh);
    return data.user;
  },

  registerDoctor: async (creds: SignupCredentials): Promise<User> => {
    const data = await apiFetch<{ user: User; access: string; refresh: string }>(
      API_ENDPOINTS.registerDoctor,
      { method: 'POST', body: JSON.stringify(creds) },
    );
    setTokens(data.access, data.refresh);
    return data.user;
  },

  registerPatient: async (creds: SignupCredentials): Promise<User> => {
    const data = await apiFetch<{ user: User; access: string; refresh: string }>(
      API_ENDPOINTS.registerPatient,
      { method: 'POST', body: JSON.stringify(creds) },
    );
    setTokens(data.access, data.refresh);
    return data.user;
  },

  logout: async (): Promise<void> => {
    const refresh = localStorage.getItem('zayra_refresh');
    await apiFetch(API_ENDPOINTS.logout, {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }).catch(() => {});
    clearTokens();
  },

  me: async (): Promise<User | null> => {
    const token = getAccessToken();
    if (!token) return null;
    return apiFetch<User>(API_ENDPOINTS.profile).catch(() => null);
  },
};

// =============================================================================
// PATIENTS API
// =============================================================================

export const patientApi = {
  getList: async (params?: { page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return apiFetch<{ results: unknown[]; count: number }>(
      `${API_ENDPOINTS.patientList}${qs ? `?${qs}` : ''}`,
    );
  },

  getDetail: async (id: number) =>
    apiFetch<unknown>(API_ENDPOINTS.patientDetail(id)),

  getRecords: async (id: number) =>
    apiFetch<{ patient_code: string; count: number; records: unknown[] }>(API_ENDPOINTS.patientRecords(id)),

  getWaveform: async (id: number) =>
    apiFetch<unknown>(API_ENDPOINTS.patientWaveform(id)),

  getClinicalInfo: async (id: number) =>
    apiFetch<unknown>(API_ENDPOINTS.patientClinicalInfo(id)),

  getDiagnosisSummary: async () =>
    apiFetch<unknown>(API_ENDPOINTS.diagnosisSummary),

  getDatasetOverview: async () =>
    apiFetch<unknown>(API_ENDPOINTS.datasetOverview),

  getWaveformAnalysis: async (id: number) =>
    apiFetch<unknown>(API_ENDPOINTS.patientWaveformAnalysis(id)),

  getWaveformAnnotations: async (id: number) =>
    apiFetch<unknown>(API_ENDPOINTS.patientWaveformAnnotations(id)),
};


// =============================================================================
// CASES API
// =============================================================================

export const casesApi = {
  getList: async (params?: {
    status?: CaseStatus;
    severity?: CaseSeverity;
    page?: number;
    mine?: boolean;
  }) => {
    const query = new URLSearchParams();
    if (params?.status)   query.set('status',   params.status);
    if (params?.severity) query.set('severity', params.severity);
    if (params?.page)     query.set('page',     String(params.page));
    if (params?.mine)     query.set('mine',     'true');
    const qs = query.toString();
    return apiFetch<CaseReviewListResponse>(
      `${API_ENDPOINTS.caseList}${qs ? `?${qs}` : ''}`,
    );
  },

  getDetail: async (id: number) =>
    apiFetch<CaseReview>(API_ENDPOINTS.caseDetail(id)),

  claim: async (id: number) =>
    apiFetch<CaseReview>(API_ENDPOINTS.caseClaim(id), { method: 'POST' }),

  complete: async (id: number, notes?: string) =>
    apiFetch<CaseReview>(API_ENDPOINTS.caseComplete(id), {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  escalate: async (id: number, notes?: string) =>
    apiFetch<CaseReview>(API_ENDPOINTS.caseEscalate(id), {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
};

// PROFILE API
export const profileApi = {
  getProfile: async (): Promise<User> =>
    apiFetch<User>(API_ENDPOINTS.profile),
};
