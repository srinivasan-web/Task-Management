'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../services/auth-api';
import { session } from '../../features/auth/session';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await authApi.login(String(form.get('email')), String(form.get('password')));
      session.set(response.data.accessToken);
      router.replace('/dashboard');
    } catch (requestError) {
      setError((requestError as { message?: string }).message ?? 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <main className="auth-page"><section className="auth-card" aria-labelledby="login-title"><div className="brand-row"><div className="brand-mark" aria-hidden="true">TM</div><span>Taskflow</span></div><p className="eyebrow">WELCOME BACK</p><h1 id="login-title">Sign in to your workspace</h1><p className="auth-subtitle">Manage your private tasks with a focused, secure workflow.</p><form className="auth-form" onSubmit={handleSubmit}><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required/><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required minLength={8}/>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</button></form><p className="auth-footer">New to Taskflow? <Link href="/register">Create an account</Link></p></section></main>;
}
