'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Brain, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function ConfirmContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const supabase = createClient();
      
      try {
        // Get the token from URL hash or query params
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token) {
          setStatus('error');
          setMessage('No confirmation token found. Please check your email link.');
          return;
        }

        // Handle different confirmation types
        if (type === 'signup') {
          // Email confirmation for new signup
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) throw error;

          setStatus('success');
          setMessage('Your email has been confirmed! Redirecting to dashboard...');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else if (type === 'recovery') {
          // Password recovery confirmation
          setStatus('success');
          setMessage('Email confirmed! Redirecting to update password...');
          
          // Redirect to update password page
          setTimeout(() => {
            router.push('/auth/update-password');
          }, 2000);
        } else if (type === 'email_change') {
          // Email change confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email_change'
          });

          if (error) throw error;

          setStatus('success');
          setMessage('Your email has been updated! Redirecting to dashboard...');
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          // Default confirmation handling
          setStatus('success');
          setMessage('Confirmation successful! Redirecting...');
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } catch (error: any) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to confirm email. The link may be expired or invalid.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ContentMind
            </span>
          </Link>
        </div>

        {/* Status Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              status === 'loading' ? 'bg-purple-500/20' :
              status === 'success' ? 'bg-green-500/20' :
              'bg-red-500/20'
            }`}>
              {status === 'loading' && (
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              )}
              {status === 'error' && (
                <XCircle className="w-8 h-8 text-red-400" />
              )}
            </div>

            {/* Title */}
            <h1 className={`text-2xl font-bold ${
              status === 'loading' ? 'text-white' :
              status === 'success' ? 'text-green-400' :
              'text-red-400'
            }`}>
              {status === 'loading' && 'Confirming...'}
              {status === 'success' && 'Confirmed!'}
              {status === 'error' && 'Confirmation Failed'}
            </h1>

            {/* Message */}
            <p className="text-gray-300">
              {message || 'Please wait while we confirm your email...'}
            </p>

            {/* Action Buttons */}
            {status === 'error' && (
              <div className="flex flex-col gap-3 w-full mt-6">
                <Link
                  href="/auth/login"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Go to Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="w-full py-3 px-4 bg-white/5 border border-purple-500/30 text-purple-400 font-semibold rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  Sign Up Again
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        {status === 'error' && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Need help?{' '}
              <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
                Contact support
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white">Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
