import type {
  User, LoginCredentials, SignupCredentials,
  CaseStatus, CaseSeverity, CaseReview, CaseReviewListResponse,
  CaseDetail, CaseOrinnAnalysis, CaseCounts,
  ImpactStats, ImpactMomentsResponse,
  PatientWaveformResponse, WaveformAnalysisResponse, RecordsIndexResponse, AlynaChatResponse, AlynaHistoryMessage,
  AssignmentsResponse,
} from '@/types';

// CONFIG
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://10.213.128.68:8000/api/v1';

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
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  let res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401) {
    const refresh = localStorage.getItem('zayra_refresh');
    if (refresh) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.tokenRefresh}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setTokens(data.access, refresh);
          headers['Authorization'] = `Bearer ${data.access}`;
          res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
        } else {
          clearTokens();
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
      } catch {
        clearTokens();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const fieldError = Object.values(err)
      .flat()
      .find((v) => typeof v === 'string') as string | undefined;
    throw new Error(
      fieldError ?? err.detail ?? err.message ?? `Request failed: ${res.status}`,
    );
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
  patientRecordsIndex: (id: number) => `/patients/${id}/records/index/`,
  patientClinicalInfo: (id: number) => `/patients/${id}/clinical-info/`,
  patientReport: (id: number) => `/patients/${id}/report/`,
  patientWaveformAnalysis: (id: number) => `/patients/${id}/waveform-analysis/`,
  patientWaveformAnnotations: (id: number) => `/patients/${id}/waveform-annotations/`,
  diagnosisSummary: '/patients/summary/',
  datasetOverview: '/patients/dataset-overview/',
  myAssignments: '/assignments/me/',
  blePredictions: (patientCode: string) => `/patients/ble-predictions/?patient_code=${patientCode}`,

  // Alyna
  alynaChat:    '/alyna/chat/',
  alynaHistory: '/alyna/history/',
  alynaClear:   '/alyna/clear/',

  // Assessments
  aiAnalysis: (id: number) => `/assessments/${id}/analyze/`,

  // Impact
  impactStats: '/impact/stats/',
  impactMoments: '/impact/moments/',

  // Cases lifecycle
  caseList: '/cases/',
  caseCounts: '/cases/counts/',
  caseDetail: (id: number) => `/cases/${id}/`,
  caseDetailFull: (id: number) => `/cases/${id}/detail/`,
  caseAnalyze: (id: number) => `/cases/${id}/analyze/`,
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
    }).catch(() => { });
    clearTokens();
  },

  me: async (): Promise<User | null> => {
    const token = getAccessToken();
    if (!token) return null;
    return apiFetch<User>(API_ENDPOINTS.profile).catch(() => null);
  },
};

// PATIENTS API
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

  getWaveform: async (
    id: number,
    opts?: { record_id?: number; channels?: string; downsample?: number },
  ) => {
    const query = new URLSearchParams();
    if (opts?.record_id) query.set('record_id', String(opts.record_id));
    if (opts?.channels)  query.set('channels',  opts.channels);
    if (opts?.downsample) query.set('downsample', String(opts.downsample));
    const qs = query.toString();
    return apiFetch<PatientWaveformResponse>(
      `${API_ENDPOINTS.patientWaveform(id)}${qs ? `?${qs}` : ''}`,
    );
  },

  getRecordsIndex: async (id: number) =>
    apiFetch<RecordsIndexResponse>(API_ENDPOINTS.patientRecordsIndex(id)),

  getClinicalInfo: async (id: number) =>
    apiFetch<unknown>(API_ENDPOINTS.patientClinicalInfo(id)),

  getDiagnosisSummary: async () =>
    apiFetch<unknown>(API_ENDPOINTS.diagnosisSummary),

  getDatasetOverview: async () =>
    apiFetch<unknown>(API_ENDPOINTS.datasetOverview),

  getWaveformAnalysis: async (id: number, recordId?: number) => {
    const qs = recordId ? `?record_id=${recordId}` : '';
    return apiFetch<WaveformAnalysisResponse>(
      `${API_ENDPOINTS.patientWaveformAnalysis(id)}${qs}`,
    );
  },

  getWaveformAnnotations: async (id: number) =>
    apiFetch<unknown>(API_ENDPOINTS.patientWaveformAnnotations(id)),
};


// ASSIGNMENTS API
export const assignmentsApi = {
  getMyAssignments: async () =>
    apiFetch<AssignmentsResponse>(API_ENDPOINTS.myAssignments),
};

// CASES API
export const casesApi = {
  getList: async (params?: {
    status?: CaseStatus;
    severity?: CaseSeverity;
    page?: number;
    page_size?: number;
    mine?: boolean;
    search?: string;
    all_assigned?: boolean;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.severity) query.set('severity', params.severity);
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    if (params?.mine) query.set('mine', 'true');
    if (params?.search) query.set('search', params.search);
    if (params?.all_assigned) query.set('all_assigned', 'true');
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

  getDetailFull: async (id: number, recordId?: number) => {
    const url = API_ENDPOINTS.caseDetailFull(id);
    return apiFetch<CaseDetail>(recordId ? `${url}?record_id=${recordId}` : url);
  },

  triggerOrinn: async (id: number, recordId?: number) =>
    apiFetch<CaseOrinnAnalysis>(API_ENDPOINTS.caseAnalyze(id), {
      method: 'POST',
      body: recordId ? JSON.stringify({ record_id: recordId }) : undefined,
    }),

  getCounts: async () =>
    apiFetch<CaseCounts>(API_ENDPOINTS.caseCounts),
};

// PROFILE API
export const profileApi = {
  getProfile: async (): Promise<User> =>
    apiFetch<User>(API_ENDPOINTS.profile),
};

// IMPACT API
export const impactApi = {
  getStats: async () =>
    apiFetch<ImpactStats>(API_ENDPOINTS.impactStats),

  getMoments: async () =>
    apiFetch<ImpactMomentsResponse>(API_ENDPOINTS.impactMoments),
};

// ALYNA API
export const alynaApi = {
  chat: async (
    message: string,
    opts?: { patient_id?: number; case_id?: number },
  ) =>
    apiFetch<AlynaChatResponse>(API_ENDPOINTS.alynaChat, {
      method: 'POST',
      body: JSON.stringify({
        message,
        ...(opts?.patient_id ? { patient_id: opts.patient_id } : {}),
        ...(opts?.case_id    ? { case_id:    opts.case_id    } : {}),
      }),
    }),

  getHistory: async (opts?: { patient_id?: number; case_id?: number }) => {
    const query = new URLSearchParams();
    if (opts?.patient_id) query.set('patient_id', String(opts.patient_id));
    if (opts?.case_id)    query.set('case_id',    String(opts.case_id));
    const qs = query.toString();
    return apiFetch<AlynaHistoryMessage[]>(
      `${API_ENDPOINTS.alynaHistory}${qs ? `?${qs}` : ''}`,
    );
  },

  clear: async () =>
    apiFetch<{ cleared: number }>(API_ENDPOINTS.alynaClear, {
      method: 'DELETE',
    }),
};

// BLE PREDICTIONS API
export const bleApi = {
  getPredictions: async (patientCode: string, limit = 10) => {
    const qs = `patient_code=${patientCode}&limit=${limit}`;
    return apiFetch<import('@/types').BLEMIPredictionListResponse>(
      `/patients/ble-predictions/?${qs}`,
    );
  },
};

// EARNINGS API
export const earningsApi = {
  getCompleted: async (params?: { page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    query.set('status', 'completed');
    const qs = query.toString();
    return apiFetch<CaseReviewListResponse>(
      `${API_ENDPOINTS.caseList}${qs ? `?${qs}` : ''}`,
    );
  },
};