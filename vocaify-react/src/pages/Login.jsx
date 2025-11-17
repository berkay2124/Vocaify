import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Login (Giriş) Sayfası
 * Kullanıcıların email ve şifre ile giriş yapmasını sağlar
 */
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(getErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'Bu email ile kayıtlı kullanıcı bulunamadı.';
            case 'auth/wrong-password':
                return 'Hatalı şifre. Lütfen tekrar deneyin.';
            case 'auth/invalid-email':
                return 'Geçersiz email adresi.';
            case 'auth/user-disabled':
                return 'Bu hesap devre dışı bırakılmış.';
            case 'auth/too-many-requests':
                return 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
            default:
                return 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>
            </div>

            <div className="glass max-w-md w-full p-8 rounded-2xl relative z-10">
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center shadow-lg mb-4">
                        <Zap className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Vocaify HR</h1>
                    <p className="text-gray-400 text-center">
                        AI Destekli İnsan Kaynakları Sistemi
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                            Email Adresi
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@email.com"
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                            Şifre
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Giriş Yapılıyor...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Giriş Yap
                            </>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Hesabınız yok mu?{' '}
                        <Link
                            to="/register"
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            Kayıt Olun
                        </Link>
                    </p>
                </div>

                {/* Demo Info */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <p className="text-blue-300 text-xs text-center">
                        💡 Demo: Herhangi bir email ve şifre ile kayıt olabilirsiniz
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
