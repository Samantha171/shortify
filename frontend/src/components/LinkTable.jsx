import { Copy, Trash2, BarChart2, Edit3, QrCode, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useState } from 'react';
import QRModal from './QRModal';
import EditLinkModal from './EditLinkModal';
import { toast } from 'react-toastify';

const LinkTable = ({ urls, refresh, showActions = true }) => {
    const [qrUrl, setQrUrl] = useState(null);
    const [editUrl, setEditUrl] = useState(null);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast('Link copied', { icon: <LinkIcon size={16} className="text-[#6aa8ff]" /> });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this link?')) {
            try {
                await API.delete(`/urls/${id}`);
                refresh();
            } catch (error) {
                console.error('Failed to delete link', error);
            }
        }
    };

    const handleQRClick = async (url) => {
        try {
            await API.patch(`/urls/${url.url_id}/qr`);
            setQrUrl(url);
        } catch (error) {
            console.error('Failed to mark QR as generated', error);
            setQrUrl(url);
        }
    };

    const getExpiryStatus = (expiry_date) => {
        if (!expiry_date) return null;
        const now = new Date();
        const expiry = new Date(expiry_date);
        const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'expired';
        if (diffDays <= 3) return 'soon';
        return 'active';
    };

    const baseUrl = (import.meta.env.VITE_API_URL || '').replace('/api', '/r/');

    return (
        <div className="max-w-full">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-white/30 text-xs uppercase tracking-widest border-b border-white/10">
                            <th className="px-6 py-4 font-semibold">Original URL</th>
                            <th className="px-6 py-4 font-semibold">Short URL</th>
                            <th className="px-6 py-4 font-semibold">Created</th>
                            <th className="px-6 py-4 font-semibold">Clicks</th>
                            {showActions && <th className="px-6 py-4 font-semibold">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {urls.length === 0 ? (
                            <tr>
                                <td colSpan={showActions ? 5 : 4} className="px-6 py-20 text-center text-white/30">
                                    No links found. Create one to get started!
                                </td>
                            </tr>
                        ) : (
                            urls.map((url) => {
                                const expiryStatus = getExpiryStatus(url.expiry_date);
                                const daysLeft = url.expiry_date
                                    ? Math.ceil((new Date(url.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))
                                    : null;

                                return (
                                    <tr key={url.url_id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-white truncate max-w-xs">
                                                    {url.original_url}
                                                </span>
                                                {url.expiry_date && (
                                                    <div className="flex items-center gap-1.5">
                                                        {expiryStatus === 'soon' && (
                                                            <span className="flex items-center gap-1 text-[10px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                                                <AlertTriangle size={9} />
                                                                Expires in {daysLeft}d
                                                            </span>
                                                        )}
                                                        {expiryStatus === 'expired' && (
                                                            <span className="flex items-center gap-1 text-[10px] font-medium bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                                                                Expired
                                                            </span>
                                                        )}
                                                        {expiryStatus === 'active' && (
                                                            <span className="text-[10px] text-orange-400">
                                                                Expires: {new Date(url.expiry_date).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {!url.expiry_date && (
                                                    <span className="text-[10px] text-white/30">No Expiry</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`${baseUrl}${url.short_code}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm text-[#6aa8ff] font-mono hover:text-white hover:underline transition-colors shorten-url"
                                                >
                                                    {baseUrl}{url.short_code}
                                                </a>

                                                <button
                                                    onClick={() => copyToClipboard(`${baseUrl}${url.short_code}`)}
                                                    className="text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="text-sm text-white/40">
                                                {new Date(url.created_at).toLocaleDateString()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-[#4988C4]/10 rounded-full text-[#6aa8ff] text-xs font-bold">
                                                {url.click_count || 0}
                                            </span>
                                        </td>

                                        {showActions && (
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setEditUrl(url)}
                                                        className="p-2 text-white/30 hover:text-[#6aa8ff] transition-colors"
                                                        title="Edit Link"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>

                                                    <Link
                                                        to={`/analytics/${url.url_id}`}
                                                        className="p-2 text-white/30 hover:text-yellow-400 transition-colors"
                                                        title="View Analytics"
                                                    >
                                                        <BarChart2 size={18} />
                                                    </Link>

                                                    <button
                                                        onClick={() => handleQRClick(url)}
                                                        className="p-2 text-white/30 hover:text-emerald-400 transition-colors"
                                                        title="Generate QR"
                                                    >
                                                        <QrCode size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(url.url_id)}
                                                        className="p-2 text-white/30 hover:text-red-400 transition-colors"
                                                        title="Delete Link"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {urls.length === 0 ? (
                    <div className="py-20 text-center text-white/30 text-sm">
                        No links found.
                    </div>
                ) : (
                    urls.map((url) => (
                        <div key={url.url_id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-white/40 truncate mb-1">{url.original_url}</p>
                                    <a
                                        href={`${baseUrl}${url.short_code}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-[#6aa8ff] font-mono block truncate"
                                    >
                                        {baseUrl}{url.short_code}
                                    </a>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(`${baseUrl}${url.short_code}`)}
                                    className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/30 uppercase">Clicks</span>
                                        <span className="text-sm font-bold text-white">{url.click_count || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/30 uppercase">Created</span>
                                        <span className="text-sm text-white/60">{new Date(url.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {showActions && (
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/analytics/${url.url_id}`}
                                            className="p-2 bg-white/5 border border-white/10 rounded-lg text-yellow-400"
                                        >
                                            <BarChart2 size={16} />
                                        </Link>
                                        <button
                                            onClick={() => setEditUrl(url)}
                                            className="p-2 bg-white/5 border border-white/10 rounded-lg text-[#6aa8ff]"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {editUrl && (
                <EditLinkModal
                    isOpen={!!editUrl}
                    onClose={() => setEditUrl(null)}
                    urlData={editUrl}
                    onSuccess={refresh}
                />
            )}

            {qrUrl && (
                <QRModal
                    isOpen={!!qrUrl}
                    onClose={() => setQrUrl(null)}
                    url={qrUrl}
                />
            )}
        </div>
    );
};

export default LinkTable;