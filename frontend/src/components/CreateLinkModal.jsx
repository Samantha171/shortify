import { useState } from 'react';
import { X, Link2, Calendar, Loader2 } from 'lucide-react';
import API from '../services/api';

const CreateLinkModal = ({ isOpen, onClose, onSuccess }) => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/urls', {
                original_url: originalUrl,
                expiry_date: expiryDate,
                custom_alias: customAlias
            });
            onSuccess();
            onClose();
            setOriginalUrl('');
            setExpiryDate('');
            setCustomAlias('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create link');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 
        text-white text-sm placeholder-white/30
        focus:outline-none focus:ring-1 focus:ring-[#4988C4]/50 focus:border-[#4988C4]/50
        transition-all`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-2xl p-7 relative shadow-2xl">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-white/30 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                        <Link2 className="text-[#6aa8ff]" size={18} />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Create New Link</h2>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Target URL */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                            Target URL
                        </label>
                        <input
                            type="url"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            className={inputClass}
                            placeholder="https://example.com/very-long-link"
                            required
                        />
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                            Expiry Date <span className="normal-case text-white/30">(optional)</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                            <input
                                type="datetime-local"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className={`${inputClass} pl-10`}
                            />
                        </div>
                    </div>

                    {/* Custom Alias */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                            Custom Alias <span className="normal-case text-white/30">(optional)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-mono">
                                /r/
                            </span>
                            <input
                                type="text"
                                value={customAlias}
                                onChange={(e) => setCustomAlias(e.target.value)}
                                className={`${inputClass} pl-10`}
                                placeholder="my-awesome-link"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2
                        bg-gradient-to-r from-[#4988C4] to-[#6aa8ff]
                        text-white font-semibold py-3 rounded-xl
                        shadow-lg shadow-blue-500/30
                        hover:scale-[1.02] transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Shorten Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLinkModal;