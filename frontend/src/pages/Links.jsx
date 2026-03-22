import { useState, useEffect } from 'react';
import API from '../services/api';
import LinkTable from '../components/LinkTable';
import CreateLinkModal from '../components/CreateLinkModal';
import BulkUploadModal from '../components/BulkUploadModal';
import { Plus, Search, Upload } from 'lucide-react';

const Links = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
    }, []);

    const filteredUrls = urls.filter(url =>
        url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.short_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Links</h1>
                    <p className="text-white/40 text-sm mt-1">
                        Manage and track your shortened URLs
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                        bg-white/5 border border-white/10 text-white/70
                        hover:bg-white/10 hover:text-white transition-all duration-200"
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
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">

                {/* Search Bar */}
                <div className="relative max-w-md mb-6">
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

                {/* Table */}
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <div className="w-8 h-8 border-2 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <LinkTable urls={filteredUrls} refresh={fetchData} showActions={true} />
                )}
            </div>

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