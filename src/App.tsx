import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginPage } from '@/pages/Login';
import { SignupPage } from '@/pages/Signup';
import { HomePage } from '@/pages/Home';
import { CasesPage } from '@/pages/Cases';
import { TraceViewPage } from '@/pages/TraceView';
import { AlynaPage } from '@/pages/Alyna';
import { ImpactPage } from '@/pages/Impact';
import { ProfilePage } from '@/pages/Profile';
import { ClaimDetailPage } from '@/pages/ClaimDetail';
import { EcgAtlasPage } from '@/pages/EcgAtlas';
import { GrandRoundsPage } from '@/pages/GrandRounds';
import { EarningsPage } from '@/pages/Earnings';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <CasesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trace"
          element={
            <ProtectedRoute>
              <TraceViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trace/:caseId"
          element={
            <ProtectedRoute>
              <TraceViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alyna"
          element={
            <ProtectedRoute>
              <AlynaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/impact"
          element={
            <ProtectedRoute>
              <ImpactPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/atlas"
          element={
            <ProtectedRoute>
              <EcgAtlasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grand-rounds"
          element={
            <ProtectedRoute>
              <GrandRoundsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/earnings"
          element={
            <ProtectedRoute>
              <EarningsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/case/:caseId"
          element={
            <ProtectedRoute>
              <ClaimDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Default + fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
