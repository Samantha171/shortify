import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-shortify-bg p-4 text-white">
            <div className="w-full max-w-md bg-shortify-card p-8 rounded-2xl shadow-2xl border border-shortify-card/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-shortify-highlight tracking-tight">SHORTIFY</h1>
                    <p className="text-gray-400 mt-2">Welcome back! Please login to your account.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-shortify-bg border border-shortify-card/50 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-shortify-btn text-sm"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-shortify-bg border border-shortify-card/50 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-shortify-btn text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-shortify-btn hover:bg-shortify-btn/90 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-shortify-btn/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-shortify-highlight font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
