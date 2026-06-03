import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@/types';
import { authApi, clearTokens, getAccessToken } from '@/services/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  skip: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = 'zayra_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  // On mount — validate token and restore session
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.me().then((u) => {
      if (u) {
        setUser(u);
      } else {
        clearTokens();
        setUser(null);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const u = await authApi.login({ email, password });
      setUser(u);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        const [first_name, ...rest] = name.trim().split(' ');
        const u = await authApi.registerDoctor({
          first_name,
          last_name: rest.join(' ') || '',
          email,
          password,
          confirm_password: password,
        });
        setUser(u);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const skip = useCallback(() => {
    setUser({
      id: 0,
      email: 'guest@zayra.app',
      first_name: 'Guest',
      last_name: 'Doctor',
      phone: null,
      role: 'doctor',
      created_at: new Date().toISOString(),
      specialization: null,
      license_number: null,
      hospital_name: null,
      years_of_experience: null,
      qualification: null,
      is_doctor: true,
      is_patient: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      login,
      signup,
      skip,
      logout,
    }),
    [user, loading, login, signup, skip, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
