import { useState, useEffect } from 'react';
import StatCards from '../components/StatCards';
import CreateLinkModal from '../components/CreateLinkModal';
import BulkUploadModal from '../components/BulkUploadModal';
import API from '../services/api';
import { Plus, LayoutGrid, List, Upload } from 'lucide-react';
import LinkTable from '../components/LinkTable';
import ScrollReveal from '../components/ScrollReveal';
import Tilt from 'react-parallax-tilt';

const Home = () => {
    const [stats, setStats] = useState({ total_links: 0, total_clicks: 0, active_links: 0 });
    const [urls, setUrls] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    const fetchData = async () => {
        try {
            const [statsRes, urlsRes] = await Promise.all([
                API.get('/urls/stats'),
                API.get('/urls')
            ]);
            setStats(statsRes.data);
            setUrls(urlsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // initial fetch

        // Auto refresh every 10 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 10000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleFocus = () => fetchData();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Dashboard Overview
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                        bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                        shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-200"
                    >
                        <Upload size={17} />
                        <span>Upload CSV</span>
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                        bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                        shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-200"
                    >
                        <Plus size={18} />
                        <span>Create Link</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <ScrollReveal>
                <StatCards
                    totalLinks={stats.total_links}
                    totalClicks={stats.total_clicks || 0}
                    activeLinks={stats.active_links || 0}
                />
            </ScrollReveal>

            {/* Recent Links */}
            <ScrollReveal className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-semibold text-white">Recent Links</h2>
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid'
                                ? 'bg-[#4988C4]/20 text-[#6aa8ff]'
                                : 'text-white/30 hover:text-white'
                                }`}
                        >
                            <LayoutGrid size={15} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list'
                                ? 'bg-[#4988C4]/20 text-[#6aa8ff]'
                                : 'text-white/30 hover:text-white'
                                }`}
                        >
                            <List size={15} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center">
                        <div className="w-8 h-8 border-2 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : viewMode === 'list' ? (
                    <LinkTable urls={urls.slice(0, 5)} refresh={fetchData} showActions={false} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {urls.slice(0, 6).map((url) => (
                            <Tilt key={url.url_id} tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2000}>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full
                                hover:border-[#4988C4]/50 hover:shadow-[0_0_20px_rgba(73,136,196,0.2)] transition-all duration-200">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <p className="text-white/60 text-xs truncate flex-1">
                                        {url.original_url}
                                    </p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${url.is_active
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                                        }`}>
                                        {url.is_active ? 'Active' : 'Expired'}
                                    </span>
                                </div>
                                <a
                                    href={`${window.location.origin.replace('5173', '5000')}/r/${url.short_code}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#6aa8ff] text-sm font-medium mb-3 truncate block hover:underline hover:text-white transition-colors"
                                >
                                    {`${window.location.origin.replace('5173', '5000')}/r/${url.short_code}`}
                                </a>
                                <div className="flex items-center justify-between text-xs text-white/30">
                                    <span>{url.click_count} clicks</span>
                                    <span className="text-orange-400">{new Date(url.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            </Tilt>
                        ))}
                        {urls.length === 0 && (
                            <div className="col-span-2 py-12 text-center text-white/30 text-sm">
                                No links yet. Create your first one!
                            </div>
                        )}
                    </div>
                )}
            </ScrollReveal>

            <CreateLinkModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchData}
            />

            <BulkUploadModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default Home;