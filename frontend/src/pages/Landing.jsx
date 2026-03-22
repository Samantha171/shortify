import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Zap, Target, BarChart } from 'lucide-react';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-shortify-bg text-white font-sans selection:bg-shortify-highlight selection:text-shortify-bg">
            <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <div className="text-3xl font-bold text-shortify-highlight">SHORTIFY</div>
                <div className="flex items-center space-x-8 text-white">
                    {user ? (
                        <Link to="/home" className="bg-shortify-btn text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-shortify-btn/90 shadow-lg shadow-shortify-btn/20">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="font-semibold hover:text-shortify-highlight transition-colors">Login</Link>
                            <Link to="/signup" className="bg-shortify-btn text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-shortify-btn/90 shadow-lg shadow-shortify-btn/20">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-24 text-center">
                <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
                    Shorten Your Links,<br />
                    <span className="text-shortify-highlight">Expand Your Reach</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                    Transform your long, messy URLs into powerful, trackable assets. 
                    Get insights, QR codes, and more with Shortify.
                </p>

                <div className="flex items-center justify-center space-x-6">
                    <Link to="/signup" className="bg-white text-shortify-bg px-10 py-5 rounded-2xl font-black text-lg transition-transform hover:scale-105">
                        Start for free
                    </Link>
                    <button className="flex items-center space-x-2 text-white font-bold group">
                        <span>Learn more</span>
                        <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32">
                    <Feature 
                        icon={<Zap className="text-shortify-highlight" size={32} />} 
                        title="Lightning Fast" 
                        desc="Create short links in seconds. Our infrastructure ensures zero-lag redirection for your users."
                    />
                    <Feature 
                        icon={<Target className="text-shortify-highlight" size={32} />} 
                        title="Fully Trackable" 
                        desc="Know exactly who clicks your links, when, and from where. Per-link analytics included."
                    />
                    <Feature 
                        icon={<BarChart className="text-shortify-highlight" size={32} />} 
                        title="QR Ready" 
                        desc="Generate high-quality QR codes for every link instantly. Download and share anywhere."
                    />
                </div>
            </main>
        </div>
    );
};

const Feature = ({ icon, title, desc }) => (
    <div className="bg-shortify-card/50 p-10 rounded-3xl border border-shortify-card hover:border-shortify-highlight/30 transition-all text-left">
        <div className="w-16 h-16 bg-shortify-bg rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

export default Landing;
