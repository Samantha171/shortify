import { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import API from '../services/api';

const BulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid CSV file');
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await API.post('/urls/bulk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(data);
            if (data.created > 0) {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload CSV');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-2xl p-7 relative shadow-2xl">

                {/* Close */}
                <button
                    onClick={handleClose}
                    className="absolute right-5 top-5 text-white/30 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                        <Upload className="text-[#6aa8ff]" size={18} />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Bulk URL Upload</h2>
                </div>

                {!result ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all
                            ${file ? 'border-[#4988C4]/50 bg-[#4988C4]/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".csv"
                                className="hidden"
                            />
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 
                                ${file ? 'bg-[#4988C4] text-white' : 'bg-white/5 text-white/30'}`}>
                                <FileText size={24} />
                            </div>
                            <p className="text-white font-medium text-sm">
                                {file ? file.name : 'Click to select CSV file'}
                            </p>
                            <p className="text-white/30 text-xs mt-2">
                                Max size: 5MB
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm italic">
                                {error}
                            </div>
                        )}

                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">CSV Format</h4>
                            <p className="text-xs text-white/50 font-mono italic">original_url, custom_alias, expiry_date</p>
                            <p className="text-[10px] text-white/20 mt-1 font-mono">Example: https://google.com, my-link, 2026-12-31</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="w-full flex items-center justify-center gap-2
                            bg-gradient-to-r from-[#4988C4] to-[#6aa8ff]
                            text-white font-semibold py-3 rounded-xl
                            shadow-lg shadow-blue-500/30
                            hover:scale-[1.02] transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Start Upload'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
                                <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-white">{result.created}</p>
                                <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Created</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center">
                                <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-white">{result.failed}</p>
                                <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Failed</p>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {result.errors.map((err, idx) => (
                                    <div key={idx} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5 text-xs">
                                        <span className="text-white/30 font-mono">Row {err.row}</span>
                                        <span className="text-red-400/80">{err.reason}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => { setResult(null); setFile(null); }}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 
                            rounded-xl text-white/60 hover:text-white font-medium transition-all text-sm"
                        >
                            Upload another file
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkUploadModal;
