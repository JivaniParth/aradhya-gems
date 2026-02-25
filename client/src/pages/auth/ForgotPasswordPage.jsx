import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authAPI } from '../../services/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetData, setResetData] = useState(null); // { resetToken, resetUrl }
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authAPI.forgotPassword(data.email);
      setResetData(res.data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (resetData?.resetUrl) {
      navigator.clipboard.writeText(`${window.location.origin}${resetData.resetUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-serif font-bold text-primary">
            Aradhya Gems
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {!submitted ? (
            <>
              <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </Link>

              <h1 className="text-2xl font-serif font-bold text-secondary mb-2">Forgot Password?</h1>
              <p className="text-gray-500 mb-6">
                Enter your registered email and we'll generate a reset link for you.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating link...</>
                  ) : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-serif font-bold text-secondary mb-2">Reset Link Ready</h2>
              <p className="text-gray-500 mb-6 text-sm">
                In production this would be emailed. For now, use the link below.
              </p>

              {/* Dev mode: show the reset link */}
              {resetData?.resetToken && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
                  <p className="text-xs font-medium text-amber-700 mb-2">🔧 Development Mode — Reset Link:</p>
                  <div className="flex gap-2">
                    <Link
                      to={resetData.resetUrl}
                      className="flex-1 text-xs text-primary break-all hover:underline"
                    >
                      {window.location.origin}{resetData.resetUrl}
                    </Link>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 p-1.5 text-gray-500 hover:text-primary"
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  {copied && <p className="text-xs text-green-600 mt-1">Copied!</p>}

                  <Link
                    to={resetData.resetUrl}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-hover transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Reset Page
                  </Link>
                </div>
              )}

              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
