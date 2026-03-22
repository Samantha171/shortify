import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ClickTrendChart from '../components/ClickTrendChart';
import Tilt from 'react-parallax-tilt';
import { BarChart2, Calendar, MousePointer2, Globe, Clock, TrendingUp, ExternalLink, ArrowLeft } from 'lucide-react';

const PublicStats = () => {
    const { short_code } = useParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await axios.get(`${apiBase}/public/${short_code}`);
                setStats(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, [short_code]);

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-8 rounded-2xl max-w-md w-full">
                <h2 className="text-xl font-bold mb-2">Error</h2>
                <p className="text-sm">{error}</p>
                <Link to="/" className="mt-6 inline-block text-[#6aa8ff] hover:underline text-sm font-medium">
                    Back to Home
                </Link>
            </div>
        </div>
    );

    const { url_details, total_clicks, trend, recent_visits, country_distribution } = stats;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic tracking-tighter uppercase">
                            Public Analytics
                        </h1>
                        <p className="text-white/40 text-sm mt-1">Detailed transparency for short link performance</p>
                    </div>
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest">Public Access</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                    
                    <div className="relative z-10 space-y-6">
                        <div>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Original Destination</p>
                            <a 
                                href={url_details.original_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xl font-medium hover:text-[#6aa8ff] transition-colors flex items-center gap-2 break-all group"
                            >
                                {url_details.original_url}
                                <ExternalLink size={18} className="text-white/20 group-hover:text-[#6aa8ff] transition-colors" />
                            </a>
                        </div>

                        <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-white/5">
                            <div>
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Short Code</p>
                                <p className="text-lg font-mono text-[#6aa8ff]">/{url_details.short_code}</p>
                            </div>
                            <div>
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Created On</p>
                                <p className="text-white/80">{new Date(url_details.created_at).toLocaleDateString()}</p>
                            </div>
                            {url_details.expiry_date && (
                                <div>
                                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Expires On</p>
                                    <p className="text-amber-400/80">{new Date(url_details.expiry_date).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Trend Chart */}
                    <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable={false} transitionSpeed={2000} className="lg:col-span-2">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex flex-col w-full
                        hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="text-[#6aa8ff]" size={20} />
                                </div>
                                <h3 className="font-bold">Click Activity</h3>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ClickTrendChart data={trend} />
                        </div>
                        </div>
                    </Tilt>

                    {/* Quick Stats */}
                    <div className="space-y-8">
                        {/* Top Locations */}
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000}>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8
                            hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Globe className="text-emerald-400" size={20} />
                                </div>
                                <h3 className="font-bold">Top Locations</h3>
                            </div>
                            <div className="space-y-4">
                                {country_distribution && country_distribution.length > 0 ? (
                                    country_distribution.slice(0, 5).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm text-white/70">{item.country || 'Unknown'}</span>
                                            <span className="text-xs text-[#6aa8ff] font-bold">{item.clicks}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/20 text-xs italic text-center py-4">No location data captured</p>
                                )}
                            </div>
                        </div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000}>
                            <div className="bg-gradient-to-br from-[#4988C4] to-[#6aa8ff] rounded-3xl p-8 shadow-2xl shadow-blue-500/20
                            hover:shadow-blue-500/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <MousePointer2 className="text-white" size={24} />
                            </div>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Clicks</p>
                            <p className="text-6xl font-black text-white">{total_clicks}</p>
                            </div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000}>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8
                            hover:border-blue-500/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                                <Clock className="text-[#6aa8ff]" size={24} />
                            </div>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Latest Visit</p>
                            <p className="text-xl font-bold">
                                {recent_visits.length > 0 ? new Date(recent_visits[0]).toLocaleDateString() : 'No activity'}
                            </p>
                            <p className="text-white/30 text-xs mt-1">
                                {recent_visits.length > 0 ? new Date(recent_visits[0]).toLocaleTimeString() : '--:--'}
                            </p>
                            </div>
                        </Tilt>
                    </div>
                </div>

                {/* Recent Visits */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-[#6aa8ff]" />
                        Recent Visitors
                    </h3>
                    <div className="space-y-4">
                        {recent_visits.length > 0 ? (
                            recent_visits.slice(0, 10).map((visit, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-[10px] font-bold text-white/40">
                                            #{recent_visits.length - index}
                                        </div>
                                        <span className="text-sm font-medium text-white/80">
                                            {new Date(visit).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="text-xs text-white/30 font-mono">
                                        {new Date(visit).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-8 text-white/20 text-sm italic">No data available yet</p>
                        )}
                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-white/20 text-xs uppercase tracking-[0.3em]">Powered by Shortify</p>
                </div>
            </div>
        </div>
    );
};

export default PublicStats;
