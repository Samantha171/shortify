import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, BarChart2, Link2, Scissors, QrCode, Upload, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import ScrollReveal from '../components/ScrollReveal';
import { useState } from "react";
import demoVideo from '../assets/demo.mp4';

const [showDemo, setShowDemo] = useState(false);
const ScissorsAnimation = () => {
    const [phase, setPhase] = useState('typing');
    const longUrl = 'https://www.example.com/very/long/url/that/nobody/wants';
    const shortUrl = 'shortify.app/x9kZm';
    const [displayed, setDisplayed] = useState('');
    const [scissorPos, setScissorPos] = useState(-10);
    const [cut, setCut] = useState(false);
    const [showShort, setShowShort] = useState(false);

    useEffect(() => {
        const animate = async () => {
            setPhase('typing');
            setCut(false);
            setShowShort(false);
            setScissorPos(-10);
            for (let i = 0; i <= longUrl.length; i++) {
                await new Promise(r => setTimeout(r, 35));
                setDisplayed(longUrl.slice(0, i));
            }
            await new Promise(r => setTimeout(r, 600));
            setPhase('cutting');
            for (let i = -10; i <= 110; i += 2) {
                await new Promise(r => setTimeout(r, 12));
                setScissorPos(i);
                if (i >= 50) setCut(true);
            }
            await new Promise(r => setTimeout(r, 200));
            setDisplayed('');
            setShowShort(true);
            for (let i = 0; i <= shortUrl.length; i++) {
                await new Promise(r => setTimeout(r, 50));
                setDisplayed(shortUrl.slice(0, i));
            }
            await new Promise(r => setTimeout(r, 2000));
            animate();
        };
        animate();
    }, []);

    return (
        <div className="relative w-full max-w-xl mx-auto my-10">
            <div className="relative bg-white/5 border border-white/20 rounded-xl px-5 py-4 flex items-center gap-3 overflow-hidden">
                <div className="flex gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-400/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/60"></div>
                </div>
                <div className="flex-1 min-w-0 relative h-6 flex items-center">
                    {!showShort ? (
                        <span className={`font-mono text-sm transition-all duration-300 ${cut ? 'text-white/30 line-through' : 'text-white/70'}`}>
                            {displayed}<span className="animate-pulse">|</span>
                        </span>
                    ) : (
                        <span className="font-mono text-sm text-[#6aa8ff] font-semibold">
                            {displayed}<span className="animate-pulse">|</span>
                        </span>
                    )}
                </div>
            </div>
            {phase === 'cutting' && (
                <div className="absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                    style={{ left: `${scissorPos}%` }}>
                    <Scissors size={28} className="text-[#6aa8ff]"
                        style={{ filter: 'drop-shadow(0 0 8px #4988C4)' }} />
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
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />

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
                        <Link to="/home" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                            bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                            shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                                bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                                shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
                                Get Started →
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-10 text-center">

                <h1 className="text-4xl md:text-7xl lg:text-[84px] font-black mb-6 leading-[1.1] tracking-[-0.02em] px-4 font-sans">
                    Shorten Your Links,{' '}
                    <span className="bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] bg-clip-text text-transparent">
                        Expand Your Reach
                    </span>
                </h1>

                <p className="text-white/60 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium px-4">
                    Transform long messy URLs into powerful trackable links.<br className="hidden md:block" /> Analytics, QR codes, and bulk upload — all in one place.
                </p>

                <div className="mb-12 px-4">
                    <ScissorsAnimation />
                </div>

                <div className="flex items-center justify-center gap-5 mt-10 px-4">
                    <button onClick={() => setShowDemo(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-black text-base
                        bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                        shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                        View Demo
                    </button>
                    {showDemo && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                            <div className="w-full max-w-3xl bg-[#0B1220] rounded-2xl border border-white/10 p-6 relative">

                                {/* Close button */}
                                <button
                                    onClick={() => setShowDemo(false)}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white"
                                >
                                    ✕
                                </button>

                                {/* Title */}
                                <h2 className="text-xl font-bold text-white mb-4">
                                    See Shortify in Action
                                </h2>

                                {/* Video */}
                                <video
                                    controls
                                    autoPlay
                                    className="w-full rounded-xl border border-white/10"
                                >
                                    <source src={demoVideo} type="video/mp4" />
                                </video>

                                {/* Optional text */}
                                <div className="mt-4 text-sm text-white/50">
                                    • Create links instantly
                                    • Generate QR codes
                                    • Track analytics
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Features — Shorten.io style layout */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20 mt-32">
                <h2 className="text-3xl font-black text-white text-center mb-4 tracking-tight">
                    Everything you need to manage your links
                </h2>
                <p className="text-white/40 text-base text-center mb-16 max-w-xl mx-auto">
                    Powerful features for individuals and teams to grow their digital presence.
                </p>

                {/* Row 1 — 2 large cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* Card 1 — Analytics (large with chart visual) */}
                    <ScrollReveal>
                        <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable={false} transitionSpeed={2000} className="h-full">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full
                            hover:border-[#4988C4]/50 hover:shadow-[0_0_30px_rgba(73,136,196,0.2)] transition-all duration-300">
                                <div className="w-10 h-10 bg-[#4988C4]/20 rounded-xl flex items-center justify-center mb-4">
                                    <BarChart2 size={20} className="text-[#6aa8ff]" />
                                </div>
                                <h3 className="text-white font-semibold text-base mb-2">Advanced Analytics</h3>
                                <p className="text-white/40 text-sm leading-relaxed mb-4">
                                    Get deep insights into your links. Track clicks in real-time,
                                    see visit history, and monitor performance with beautiful charts.
                                </p>
                                {/* Mini chart visual */}
                                <div className="bg-white/5 rounded-xl p-4 flex items-end gap-2 h-20">
                                    {[30, 55, 40, 70, 45, 80, 90].map((h, i) => (
                                        <div key={i} className="flex-1 rounded-sm transition-all"
                                            style={{
                                                height: `${h}%`,
                                                background: i === 6
                                                    ? 'linear-gradient(to top, #4988C4, #6aa8ff)'
                                                    : 'rgba(73,136,196,0.3)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Tilt>
                    </ScrollReveal>

                    {/* Card 2 — QR Code (large with QR visual) */}
                    <ScrollReveal>
                        <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable={false} transitionSpeed={2000} className="h-full">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full
                            hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <QrCode size={20} className="text-emerald-400" />
                                </div>
                                <h3 className="text-white font-semibold text-base mb-2">QR Code Generation</h3>
                                <p className="text-white/40 text-sm leading-relaxed mb-4">
                                    Generate high-quality QR codes for every short link instantly.
                                    Download as PNG and share anywhere — print, social, or email.
                                </p>
                                {/* Mini QR visual */}
                                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-center h-20">
                                    <div className="grid grid-cols-7 gap-0.5">
                                        {[1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1].map((on, i) => (
                                            <div key={i} className={`w-2 h-2 rounded-sm ${on ? 'bg-emerald-400' : 'bg-transparent'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Tilt>
                    </ScrollReveal>
                </div>

                {/* Row 2 — 3 smaller cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 3 — Lightning fast */}
                    <ScrollReveal>
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000} className="h-full">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full
                            hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-300">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Zap size={20} className="text-amber-400" />
                                </div>
                                <h3 className="text-white font-semibold text-base mb-2">Lightning fast</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    Create short links in seconds. Zero-lag redirection every time.
                                </p>
                            </div>
                        </Tilt>
                    </ScrollReveal>

                    {/* Card 4 — Bulk Upload */}
                    <ScrollReveal>
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000} className="h-full">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full
                            hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Upload size={20} className="text-purple-400" />
                                </div>
                                <h3 className="text-white font-semibold text-base mb-2">Bulk CSV upload</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    Upload hundreds of URLs at once via CSV. Save time, scale fast.
                                </p>
                            </div>
                        </Tilt>
                    </ScrollReveal>

                    {/* Card 5 — Expiry dates */}
                    <ScrollReveal>
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000} className="h-full">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full
                            hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all duration-300">
                                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Clock size={20} className="text-pink-400" />
                                </div>
                                <h3 className="text-white font-semibold text-base mb-2">Expiry dates</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    Set links to auto-expire. Perfect for time-sensitive campaigns.
                                </p>
                            </div>
                        </Tilt>
                    </ScrollReveal>
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
                        <button onClick={() => setShowDemo(false)}
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

export default Landing;