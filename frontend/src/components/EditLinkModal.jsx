import { useState, useEffect } from 'react';
import { X, Edit3, Globe, Calendar, Link as LinkIcon, Loader2 } from 'lucide-react';
import API from '../services/api';

const EditLinkModal = ({ isOpen, onClose, urlData, onSuccess }) => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (urlData) {
            setOriginalUrl(urlData.original_url);
            setExpiryDate(urlData.expiry_date ? urlData.expiry_date.split('T')[0] : '');
        }
    }, [urlData]);

    if (!isOpen || !urlData) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await API.put(`/urls/${urlData.url_id}`, {
                original_url: originalUrl,
                expiry_date: expiryDate || null
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update link');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#4988C4]/50 focus:border-[#4988C4]/50 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-2xl p-7 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                
                <button 
                    onClick={onClose}
                    className="absolute right-5 top-5 text-white/30 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                        <Edit3 className="text-[#6aa8ff]" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Edit Link</h2>
                        <p className="text-white/40 text-xs mt-0.5 font-mono">/{urlData.short_code}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Destination URL */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Globe size={12} className="text-[#4988C4]" />
                            Destination URL
                        </label>
                        <input
                            type="url"
                            required
                            placeholder="https://example.com/very-long-url"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Short Code (Disabled) */}
                    <div className="space-y-2 opacity-50">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <LinkIcon size={12} className="text-[#4988C4]" />
                            Short Code (Alias)
                        </label>
                        <input
                            type="text"
                            disabled
                            value={urlData.short_code}
                            className={`${inputClass} cursor-not-allowed`}
                        />
                        <p className="text-[10px] text-white/20 italic">Short codes cannot be changed after creation</p>
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={12} className="text-[#4988C4]" />
                            Expiration Date (Optional)
                        </label>
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={inputClass}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm italic">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLinkModal;
