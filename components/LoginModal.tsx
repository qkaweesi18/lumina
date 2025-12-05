import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { signInWithGoogle, demoLogin, loginWithEmail, signupWithEmail } = useAuth();
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted) return null;

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await signInWithGoogle();
            onClose();
        } catch (err) {
            setError('Failed to sign in with Google. Try Demo Mode if no keys are set.');
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignUp) {
                await signupWithEmail(email, password);
            } else {
                await loginWithEmail(email, password);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to authenticate. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        demoLogin();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform -rotate-3">
                            <span className="text-2xl font-bold">L</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-gray-500">
                            {isSignUp ? 'Enter your details to get started' : 'Enter your details to access your account'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2 animate-shake">
                            <div className="mt-0.5 min-w-[4px] h-4 bg-red-500 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-5 mb-8">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-medium"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-shine"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            Google
                        </button>

                        <button
                            onClick={handleDemoLogin}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                        >
                            <User className="w-5 h-5" />
                            Demo
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="font-bold text-black hover:underline transition-all"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
