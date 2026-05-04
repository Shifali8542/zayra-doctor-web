import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useLoginForm } from '@/hooks/useAuthForm';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { email, password, setEmail, setPassword, loading, error, submit, skip } =
    useLoginForm();

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSkip = () => {
    skip();
    navigate('/home', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <div className="min-h-screen bg-app">
      <div className="mx-auto w-full max-w-xl px-5 py-6 sm:py-10">
        {/* Brand row */}
        <div className="mb-4 flex items-center gap-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary)]">
            <Icon name="pulse" size={18} color="#1FA59B" strokeWidth={2.4} />
          </div>
          <span className="text-[16px] font-bold tracking-[3px] text-[var(--color-text-primary)]">
            ZAYRA
          </span>
        </div>

        {/* Hero */}
        <div className="hero-gradient mb-6 rounded-2xl p-6 sm:p-8">
          <p className="eyebrow mb-3 text-white/80" style={{ letterSpacing: '1.4px' }}>
            VERIFIED CARDIOLOGISTS ONLY
          </p>
          <h1 className="mb-3 text-[26px] font-bold leading-[32px] text-white sm:text-[28px]">
            Welcome back, Doctor.
          </h1>
          <p className="text-[14px] leading-[22px] text-white/80">
            Sign in to review live anomalies and continue your streak of saved lives.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            placeholder="you@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            iconLeft="search"
            autoComplete="email"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            iconLeft="shield"
            autoComplete="current-password"
          />

          {error ? (
            <p className="text-[13px] text-[var(--color-danger)]">{error}</p>
          ) : null}

          <div className="mt-2 flex flex-col gap-3">
            <Button
              label="Sign in"
              type="submit"
              fullWidth
              size="lg"
              iconRight="arrow-right"
              loading={loading}
            />
            <Button
              label="Skip for now"
              variant="secondary"
              fullWidth
              size="lg"
              onClick={handleSkip}
            />
          </div>

          <div className="mt-6 self-center text-center">
            <Link
              to="/signup"
              className="text-[14px] text-[var(--color-text-secondary)] transition hover:opacity-70"
            >
              New to Zayra?{' '}
              <span className="font-bold text-[var(--color-primary)]">
                Create an account
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
