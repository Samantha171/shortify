import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import VisitList from '../components/VisitList';
import ClickTrendChart from '../components/ClickTrendChart';
import ScrollReveal from '../components/ScrollReveal';
import Tilt from 'react-parallax-tilt';
import { BarChart2, Calendar, MousePointer2, ArrowLeft, ExternalLink, Globe, Clock, TrendingUp, Share2, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const Analytics = () => {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!id) { setLoading(false); return; }
            try {
                const [analyticsRes, trendsRes] = await Promise.all([
                    API.get(`/analytics/${id}`),
                    API.get(`/analytics/${id}/trends`)
                ]);
                setAnalytics(analyticsRes.data);
                setTrends(trendsRes.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 10000);
        return () => clearInterval(interval);
    }, [id]);

    if (!id) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-5">
                    <BarChart2 className="text-[#6aa8ff]" size={28} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Select a link</h2>
                <p className="text-white/40 text-sm max-w-sm mb-6">Go to your links list and click the analytics icon on any link.</p>
                <Link to="/links"
                    className="px-5 py-2.5 rounded-xl text-sm font-medium
                    bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                    shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
                    View My Links
                </Link>
            </div>
        );
    }

    if (loading) return (
        <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl text-center text-sm">
            {error}
        </div>
    );

    const { url, totalClicks, lastVisited, recentVisits, country_distribution } = analytics;

    const handleShare = () => {
        const publicUrl = `${window.location.origin}/r/${url.short_code}/stats`;
        navigator.clipboard.writeText(publicUrl);
        toast('Link copied', { icon: <LinkIcon size={16} className="text-[#6aa8ff]" /> });
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/links"
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl
                    text-white/40 hover:text-white transition-all">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Link Analytics</h1>
                    <p className="text-white/40 font-mono text-xs mt-0.5">/{url.short_code}</p>
                </div>
                
                <button 
                    onClick={handleShare}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 
                    rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all group"
                >
                    <Share2 size={16} className="text-[#6aa8ff] group-hover:scale-110 transition-transform" />
                    Share Stats
                </button>
            </div>

            {/* 1. Original URL card — full width */}
            <ScrollReveal className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3">
                    Original URL
                </p>
                <a
                    href={url.original_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white font-medium hover:text-[#6aa8ff] transition-colors flex items-start gap-2 break-all text-sm"
                >
                    {url.original_url}
                    <ExternalLink size={14} className="flex-shrink-0 mt-0.5" />
                </a>
                <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                        <Calendar size={13} className="text-[#4988C4]" />
                        <span>Created {new Date(url.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                        <Globe size={13} className="text-[#4988C4]" />
                        <span className={url.is_active ? 'text-emerald-400' : 'text-red-400'}>
                            {url.is_active ? 'Active' : 'Disabled'}
                        </span>
                    </div>
                </div>
            </ScrollReveal>

            {/* 2. Middle row — chart left, stats right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Click Trends chart — left 2/3 */}
                <ScrollReveal className="lg:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col w-full h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#4988C4]/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-[#6aa8ff]" size={15} />
                        </div>
                        <h2 className="text-sm font-semibold text-white">Click trends</h2>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ClickTrendChart data={trends} />
                    </div>
                </ScrollReveal>

                {/* Stats — right 1/3 */}
                <div className="flex flex-col gap-6">
                    {/* Top Locations */}
                    <ScrollReveal>
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000} className="flex-1">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full
                            hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <Globe className="text-emerald-400" size={15} />
                            </div>
                            <h2 className="text-sm font-semibold text-white">Top locations</h2>
                        </div>
                        <div className="space-y-3">
                            {country_distribution && country_distribution.length > 0 ? (
                                country_distribution.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 group-hover:bg-emerald-500 transition-colors" />
                                            <span className="text-xs text-white/70 font-medium">{item.country || 'Unknown'}</span>
                                        </div>
                                        <span className="text-xs text-white/30 font-mono">{item.clicks} clicks</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] text-white/20 italic text-center py-4">No location data yet</p>
                            )}
                        </div>
                        </div>
                        </Tilt>
                    </ScrollReveal>


                    {/* Total Interactions */}
                    <ScrollReveal>
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000}>
                            <div className="bg-gradient-to-br from-[#4988C4] to-[#6aa8ff] rounded-2xl p-6
                            shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] flex flex-col items-center text-center transition-all duration-300">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                            <MousePointer2 className="text-white" size={22} />
                        </div>
                        <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                            Total interactions
                        </p>
                        <p className="text-5xl font-black text-white">{totalClicks}</p>
                            </div>
                        </Tilt>
                    </ScrollReveal>

                    {/* Last Impact */}
                    <ScrollReveal>
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000}>
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6
                            hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col items-center text-center transition-all duration-300">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                            <Clock className="text-[#6aa8ff]" size={22} />
                        </div>
                        <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-1">
                            Last impact
                        </p>
                        <p className="text-2xl font-bold text-white">
                            {lastVisited ? new Date(lastVisited).toLocaleDateString() : 'Never'}
                        </p>
                        <p className="text-xs text-white/30 mt-1">
                            {lastVisited ? new Date(lastVisited).toLocaleTimeString() : '—'}
                        </p>
                            </div>
                        </Tilt>
                    </ScrollReveal>
                </div>
            </div>

            {/* 3. Recent Visits Timeline — full width */}
            <ScrollReveal className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-white">Recent visits timeline</h2>
                    <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium
                    bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                        Live feed
                    </span>
                </div>
                <VisitList visits={recentVisits} />
            </ScrollReveal>

        </div>
    );
};

export default Analytics;