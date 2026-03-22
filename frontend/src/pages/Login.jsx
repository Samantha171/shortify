import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, Link2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4
        text-white text-sm placeholder-white/30
        focus:outline-none focus:ring-1 focus:ring-[#4988C4]/50 focus:border-[#4988C4]/50
        transition-all`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1220] p-4 relative overflow-hidden">

            {/* Glow orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4988C4] to-[#6aa8ff] rounded-xl
                    flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Link2 size={20} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-wide">Shortify</span>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">

                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold text-white">Welcome back</h1>
                        <p className="text-white/40 text-sm mt-1">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-5 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClass}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 mt-2
                            bg-gradient-to-r from-[#4988C4] to-[#6aa8ff]
                            text-white font-semibold py-3 rounded-xl
                            shadow-lg shadow-blue-500/30
                            hover:scale-[1.02] transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in →'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-white/40 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[#6aa8ff] font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;