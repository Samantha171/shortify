import { useState, useEffect } from 'react';
import API from '../services/api';
import LinkTable from '../components/LinkTable';
import CreateLinkModal from '../components/CreateLinkModal';
import BulkUploadModal from '../components/BulkUploadModal';
import ScrollReveal from '../components/ScrollReveal';
import { Plus, Search, Upload, SlidersHorizontal } from 'lucide-react';

const Links = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchData = async () => {
        try {
            const { data } = await API.get('/urls');
            setUrls(data);
        } catch (error) {
            console.error('Failed to fetch links', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const getExpiryStatus = (expiry_date) => {
        if (!expiry_date) return 'none';
        const now = new Date();
        const expiry = new Date(expiry_date);
        const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'expired';
        if (diffDays <= 3) return 'soon';
        return 'active';
    };

    const processedUrls = urls
        .filter(url => {
            // Search filter
            const matchesSearch =
                url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                url.short_code.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const status = getExpiryStatus(url.expiry_date);
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && (status === 'active' || status === 'none') && url.is_active) ||
                (statusFilter === 'expiring' && status === 'soon') ||
                (statusFilter === 'expired' && status === 'expired');

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
            if (sortBy === 'most_clicked') return (b.click_count || 0) - (a.click_count || 0);
            if (sortBy === 'least_clicked') return (a.click_count || 0) - (b.click_count || 0);
            return 0;
        });

    const selectClass = `bg-white/5 border border-white/10 rounded-xl px-3 py-2
        text-white/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#4988C4]/50
        cursor-pointer transition-all hover:border-white/20`;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Links</h1>
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

            {/* Search + Table Card */}
            <ScrollReveal className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">

                {/* Search + Filters row */}
                <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">

                    {/* Search */}
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                            type="text"
                            placeholder="Search by URL or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4
                            text-sm text-white placeholder-white/30
                            focus:outline-none focus:ring-1 focus:ring-[#4988C4]/50 focus:border-[#4988C4]/50
                            transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={14} className="text-white/30" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={selectClass}
                        >
                            <option value="all" className="bg-[#0B1220]">All status</option>
                            <option value="active" className="bg-[#0B1220]">Active</option>
                            <option value="expiring" className="bg-[#0B1220]">Expiring soon</option>
                            <option value="expired" className="bg-[#0B1220]">Expired</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={selectClass}
                        >
                            <option value="newest" className="bg-[#0B1220]">Newest first</option>
                            <option value="oldest" className="bg-[#0B1220]">Oldest first</option>
                            <option value="most_clicked" className="bg-[#0B1220]">Most clicked</option>
                            <option value="least_clicked" className="bg-[#0B1220]">Least clicked</option>
                        </select>
                    </div>
                </div>

                {/* Result count */}
                <p className="text-xs text-white/30 mb-4">
                    {processedUrls.length} of {urls.length} links
                </p>

                {/* Table */}
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <div className="w-8 h-8 border-2 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <LinkTable urls={processedUrls} refresh={fetchData} showActions={true} />
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

export default Links;