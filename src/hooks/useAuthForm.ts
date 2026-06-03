import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toFriendlyAuthError = (err: unknown): string => {
  const msg = err instanceof Error ? err.message : '';
  if (!msg) return 'Something went wrong. Please try again.';
  const lower = msg.toLowerCase();
  if (lower.includes('network') || lower.includes('failed to fetch'))
    return 'Network error. Please check your connection.';
  if (lower.includes('invalid email or password') || lower.includes('no active account'))
    return 'Incorrect email or password. Please try again.';
  if (lower.includes('not found') || lower.includes('account'))
    return 'No account found with this email.';
  if (lower.includes('token') || lower.includes('expired'))
    return 'Your session has expired. Please log in again.';
  if (lower.includes('500') || lower.includes('server'))
    return 'Server error. Please try again in a moment.';
  return msg;
};

export const useLoginForm = () => {
  const { login, skip } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(toFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return { email, password, setEmail, setPassword, loading, error, submit, skip };
};

export const useSignupForm = () => {
  const { signup, skip } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
   try {
      await signup(name, email, password);
    } catch (err: unknown) {
      setError(toFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
