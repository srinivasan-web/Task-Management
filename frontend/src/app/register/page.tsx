'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../services/auth-api';
import { session } from '../../features/auth/session';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await authApi.register(String(form.get('name')), String(form.get('email')), String(form.get('password')));
      session.set(response.data.accessToken);
      router.replace('/dashboard');
    } catch (requestError) {
      setError((requestError as { message?: string }).message ?? 'Unable to create your account.');
    } finally { setIsSubmitting(false); }
  }

  return <main className="auth-page"><section className="auth-card" aria-labelledby="register-title"><div className="brand-row"><div className="brand-mark" aria-hidden="true">TM</div><span>Taskflow</span></div><p className="eyebrow">GET STARTED</p><h1 id="register-title">Create your workspace</h1><p className="auth-subtitle">One account, one private task space. Start planning with confidence.</p><form className="auth-form" onSubmit={handleSubmit}><label htmlFor="name">Full name</label><input id="name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" required maxLength={100}/><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required/><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" required minLength={8} maxLength={128}/>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</button></form><p className="auth-footer">Already have an account? <Link href="/login">Sign in</Link></p></section></main>;
}
