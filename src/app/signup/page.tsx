'use client';

import { Logo } from '@/components/brand/Logo';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

import { APP_CONFIG } from '@/lib/constants';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050810] p-6 font-sans">
        <div className="w-full max-w-md animate-fade-in-up text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-3xl">
            ✉️
          </div>
          <h1 className="mb-3 text-2xl font-bold text-white">Check your email</h1>
          <p className="mb-8 leading-relaxed text-zinc-400">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
            Click the link to activate your account and start protecting your browser with {APP_CONFIG.name}.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl border border-white/8 bg-white/2 px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all duration-300 hover:border-white/15 hover:bg-white/5 hover:text-white"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050810] p-6 font-sans">
      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/2 top-[20%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-neon-blue/15 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo & heading */}
        <div className="mb-10 text-center flex flex-col items-center">
          <Logo iconSize="lg" showText={false} />

          <h1 className="text-2xl font-bold text-white mt-8">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Start protecting your browser with {APP_CONFIG.name} in minutes.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/6 bg-white/2 p-8 backdrop-blur-sm">
          {/* Social login */}
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/8 bg-white/2 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/5 hover:border-white/15 hover:-translate-y-px"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/4" />
            </div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
              <span className="bg-card px-4">Or Create Identity</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Identity / Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border border-white/6 bg-white/2 px-5 py-4 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-neon-blue/30 focus:bg-white/4"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Secure Passphrase
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-xl border border-white/6 bg-white/2 px-5 py-4 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-neon-blue/30 focus:bg-white/4"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Verify Passphrase
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full rounded-xl border border-white/6 bg-white/2 px-5 py-4 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-neon-blue/30 focus:bg-white/4"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-center text-[10px] font-bold text-red-400 uppercase tracking-wider animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-neon-blue/20 bg-neon-blue/10 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all duration-300 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_25px_rgba(0,210,255,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              id="signup-submit"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
              ) : (
                'Initialise Account'
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-neon-blue transition-colors hover:opacity-80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
