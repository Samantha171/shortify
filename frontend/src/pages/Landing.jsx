import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Target, BarChart2, Link2, Scissors } from 'lucide-react';
import { useEffect, useState } from 'react';

const ScissorsAnimation = () => {
    const [phase, setPhase] = useState('typing');
    const longUrl = 'https://www.example.com/very/long/url/that/nobody/wants';
    const shortUrl = 'shortify.app/x9kZm';
    const [displayed, setDisplayed] = useState('');
    const [scissorPos, setScissorPos] = useState(-10);
    const [cut, setCut] = useState(false);
    const [showShort, setShowShort] = useState(false);

    useEffect(() => {
        let timeout;
        const animate = async () => {
            // Phase 1: type the long URL
            setPhase('typing');
            setCut(false);
            setShowShort(false);
            setScissorPos(-10);
            for (let i = 0; i <= longUrl.length; i++) {
                await new Promise(r => setTimeout(r, 35));
                setDisplayed(longUrl.slice(0, i));
            }
            await new Promise(r => setTimeout(r, 600));

            // Phase 2: scissors slide across
            setPhase('cutting');
            for (let i = -10; i <= 110; i += 2) {
                await new Promise(r => setTimeout(r, 12));
                setScissorPos(i);
                if (i >= 50) setCut(true);
            }
            await new Promise(r => setTimeout(r, 200));

            // Phase 3: show short URL
            setDisplayed('');
            setShowShort(true);
            for (let i = 0; i <= shortUrl.length; i++) {
                await new Promise(r => setTimeout(r, 50));
                setDisplayed(shortUrl.slice(0, i));
            }
            await new Promise(r => setTimeout(r, 2000));

            // Restart
            animate();
        };
        animate();
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative w-full max-w-xl mx-auto my-10">
            {/* URL Bar */}
            <div className="relative bg-white/5 border border-white/20 rounded-xl px-5 py-4 flex items-center gap-3 overflow-hidden">
                <div className="flex gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-400/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/60"></div>
                </div>
                <div className="flex-1 min-w-0 relative h-6 flex items-center">
                    {!showShort ? (
                        <span className={`font-mono text-sm transition-all duration-300 ${cut ? 'text-white/30 line-through' : 'text-white/70'
                            }`}>
                            {displayed}
                            <span className="animate-pulse">|</span>
                        </span>
                    ) : (
                        <span className="font-mono text-sm text-[#6aa8ff] font-semibold">
                            {displayed}
                            <span className="animate-pulse">|</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Scissors */}
            {phase === 'cutting' && (
                <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all z-10 pointer-events-none"
                    style={{ left: `${scissorPos}%` }}
                >
                    <Scissors
                        size={28}
                        className="text-[#6aa8ff] drop-shadow-lg"
                        style={{ filter: 'drop-shadow(0 0 8px #4988C4)' }}
                    />
                </div>
            )}
        </div>
    );
};

const Landing = () => {
    const { user } = useAuth();
    const [showDemo, setShowDemo] = useState(false);

    return (
        <div className="min-h-screen bg-[#0B1220] text-white overflow-hidden relative">

            {/* Glow orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#4988C4]/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#4988C4] to-[#6aa8ff] rounded-xl
                    flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Link2 size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">Shortify</span>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <Link to="/home"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                            bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                            shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login"
                                className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                                Login
                            </Link>
                            <Link to="/signup"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                                bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                                shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-16 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#4988C4]/10 border border-[#4988C4]/20
                px-4 py-1.5 rounded-full text-xs font-medium text-[#6aa8ff] mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6aa8ff] animate-pulse"></div>
                    Free URL shortener with analytics
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                    Shorten Your Links,<br />
                    <span className="bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] bg-clip-text text-transparent">
                        Expand Your Reach
                    </span>
                </h1>

                <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
                    Transform long messy URLs into powerful trackable links.
                    Analytics, QR codes, and bulk upload — all in one place.
                </p>

                {/* Scissors Animation */}
                <ScissorsAnimation />

                {/* CTA Buttons */}
                <div className="flex items-center justify-center gap-4 mt-6">
                    <Link to="/signup"
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm
                        bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                        shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
                        Get Started Free →
                    </Link>
                    <button
                        onClick={() => setShowDemo(true)}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm
                        bg-white/5 border border-white/10 text-white/70 hover:text-white
                        hover:bg-white/10 transition-all">
                        View Demo
                    </button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 mt-12 text-sm text-white/30">
                    <span>10k+ Links shortened</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>50k+ Clicks tracked</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>99.9% Uptime</span>
                </div>
            </main>

            {/* Feature Cards */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Zap size={20} className="text-[#6aa8ff]" />}
                        iconBg="bg-[#4988C4]/20"
                        title="Lightning fast"
                        desc="Create short links in seconds. Zero-lag redirection for your users every time."
                    />
                    <FeatureCard
                        icon={<Target size={20} className="text-emerald-400" />}
                        iconBg="bg-emerald-500/20"
                        title="Fully trackable"
                        desc="Know exactly who clicks your links, when, and how often. Per-link analytics included."
                    />
                    <FeatureCard
                        icon={<BarChart2 size={20} className="text-amber-400" />}
                        iconBg="bg-amber-500/20"
                        title="QR ready"
                        desc="Generate high-quality QR codes for every link instantly. Download and share anywhere."
                    />
                </div>
            </div>

            {/* Demo Modal */}
            {showDemo && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowDemo(false)}>
                    <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 max-w-md w-full"
                        onClick={e => e.stopPropagation()}>
                        <h3 className="text-white font-semibold text-base mb-4">How Shortify works</h3>
                        <div className="space-y-3">
                            {[
                                { step: '1', text: 'Paste your long URL into Shortify' },
                                { step: '2', text: 'Get a clean short link instantly' },
                                { step: '3', text: 'Share it anywhere — we track every click' },
                                { step: '4', text: 'View analytics and download QR codes' },
                            ].map(item => (
                                <div key={item.step} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                                    <div className="w-7 h-7 rounded-full bg-[#4988C4]/20 text-[#6aa8ff]
                                    flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {item.step}
                                    </div>
                                    <p className="text-white/70 text-sm">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowDemo(false)}
                            className="w-full mt-5 py-2.5 rounded-xl text-sm font-medium
                            bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                            shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                            Get Started Free →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const FeatureCard = ({ icon, iconBg, title, desc }) => (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6
    hover:border-[#4988C4]/30 hover:bg-white/8 transition-all duration-300">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
            {icon}
        </div>
        <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
        <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default Landing;