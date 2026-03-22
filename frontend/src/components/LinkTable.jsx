import { Copy, Trash2, BarChart2, ExternalLink, Edit3, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useState } from 'react';
import QRModal from './QRModal';
import EditLinkModal from './EditLinkModal';


const LinkTable = ({ urls, refresh, showActions = true }) => {

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
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
            // Call API to mark QR as generated
            await API.patch(`/urls/${url.url_id}/qr`);
            // Open modal
            setQrUrl(url);
        } catch (error) {
            console.error('Failed to mark QR as generated', error);
            // Still open modal even if tracking fails to not block user
            setQrUrl(url);
        }
    };

    const [qrUrl, setQrUrl] = useState(null);
    const [editUrl, setEditUrl] = useState(null);

    const baseUrl = 'http://localhost:5000/r/';

    return (
        <div className="overflow-x-auto">
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
                        urls.map((url) => (
                            <tr key={url.url_id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white truncate max-w-xs">
                                            {url.original_url}
                                        </span>
                                        <span className={`text-[10px] mt-1 ${url.expiry_date ? 'text-orange-400' : 'text-white/30'}`}>
                                            {url.expiry_date ? `Expires: ${new Date(url.expiry_date).toLocaleDateString()}` : 'No Expiry'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`${baseUrl}${url.short_code}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-[#6aa8ff] font-mono hover:text-white hover:underline transition-colors"
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
                        ))
                    )}
                </tbody>
            </table>
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