'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[rgb(var(--bg-primary))] via-[rgb(var(--bg-secondary))] to-[rgb(var(--bg-primary))]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--accent-intelligence))] to-[rgb(var(--accent-ai))] flex items-center justify-center glow-intelligence"
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-primary group-hover:text-intelligence transition-colors">
              ContentMind
            </span>
          </Link>
        </div>

        {/* Card */}
        <Card variant="elevated" className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome back</h1>
            <p className="text-sm text-secondary">
              Your content intelligence remembers
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-400 font-medium">
                  {error}
                </p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[rgb(var(--bg-tertiary))]/80 border border-[rgb(var(--border-subtle))] rounded-lg text-sm text-primary placeholder-dim focus:outline-none focus:border-intelligence/50 focus:ring-2 focus:ring-intelligence/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-[rgb(var(--bg-tertiary))]/80 border border-[rgb(var(--border-subtle))] rounded-lg text-sm text-primary placeholder-dim focus:outline-none focus:border-intelligence/50 focus:ring-2 focus:ring-intelligence/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dim hover:text-secondary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-intelligence hover:text-intelligence/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="intelligence"
              size="lg"
              loading={loading}
              icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[rgb(var(--border-subtle))]" />
            <span className="text-xs text-tertiary">OR</span>
            <div className="flex-1 h-px bg-[rgb(var(--border-subtle))]" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-secondary">
              Don't have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="text-intelligence hover:text-intelligence/80 font-medium transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-tertiary">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-intelligence hover:text-intelligence/80 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-intelligence hover:text-intelligence/80 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
