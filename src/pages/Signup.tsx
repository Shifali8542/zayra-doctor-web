import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useSignupForm } from '@/hooks/useAuthForm';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    loading,
    error,
    submit,
    skip,
  } = useSignupForm();

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
        {/* Back row */}
        <Link
          to="/login"
          className="mb-2 inline-flex items-center gap-2 py-3 text-[14px] font-medium text-[var(--color-text-primary)] transition hover:opacity-70"
        >
          <Icon name="chevron-left" size={20} color="var(--color-text-primary)" />
          Back
        </Link>

        {/* Hero */}
        <div className="hero-gradient mb-6 rounded-2xl p-6 sm:p-8">
          <p className="eyebrow mb-3 text-white/80" style={{ letterSpacing: '1.4px' }}>
            JOIN THE ZAYRA NETWORK
          </p>
          <h1 className="mb-3 text-[26px] font-bold leading-[32px] text-white sm:text-[28px]">
            Create your account
          </h1>
          <p className="text-[14px] leading-[22px] text-white/80">
            Verified cardiologists review high-stakes anomalies in seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="Dr. Sanjana Rao"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <Input
            label="Email"
            placeholder="you@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
          <Input
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
          />

          {error ? (
            <p className="text-[13px] text-[var(--color-danger)]">{error}</p>
          ) : null}

          <div className="mt-2 flex flex-col gap-3">
            <Button
              label="Create account"
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
              to="/login"
              className="text-[14px] text-[var(--color-text-secondary)] transition hover:opacity-70"
            >
              Already have an account?{' '}
              <span className="font-bold text-[var(--color-primary)]">Sign in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
