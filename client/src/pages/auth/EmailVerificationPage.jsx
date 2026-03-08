import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function EmailVerificationPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const { data } = await authAPI.verifyEmail(token);
                setStatus('success');
                setMessage(data.message);

                // Auto-login the user if token was returned
                if (data.data?.token && data.data?.user) {
                    setAuth(data.data.user, data.data.token);
                    // Redirect to home after 3 seconds
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be expired.');
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                {/* Logo */}
                <h1 className="font-serif text-2xl font-bold text-primary mb-8">Aradhya Gems</h1>

                {status === 'verifying' && (
                    <div className="space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                        <h2 className="text-xl font-serif font-bold text-secondary">Verifying Your Email</h2>
                        <p className="text-muted-foreground">Please wait while we verify your email address...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-secondary">Email Verified!</h2>
                        <p className="text-muted-foreground">{message}</p>
                        <p className="text-sm text-muted-foreground">Redirecting you to the homepage...</p>
                        <Link to="/">
                            <Button className="mt-4">Go to Homepage</Button>
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-secondary">Verification Failed</h2>
                        <p className="text-muted-foreground">{message}</p>
                        <div className="flex flex-col gap-3 mt-6">
                            <Link to="/login">
                                <Button variant="outline" className="w-full">Go to Login</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
