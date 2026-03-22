import { X, Download, Copy, Link as LinkIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { downloadQR } from '../utils/qrGenerator';
import { toast } from 'react-toastify';

const QRModal = ({ isOpen, onClose, url }) => {
    if (!isOpen || !url) return null;

    const shortUrl = `http://localhost:5000/r/${url.short_code}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        toast('Link copied', { icon: <LinkIcon size={16} className="text-[#6aa8ff]" /> });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#0B1220] border border-white/10 rounded-2xl p-6 relative shadow-2xl text-center">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white/30 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-white font-semibold text-base mb-1">QR Code</h2>
                <p className="text-[#6aa8ff] text-xs font-mono truncate mb-5">{shortUrl}</p>

                {/* QR */}
                <div className="flex justify-center mb-5">
                    <div className="bg-white p-4 rounded-xl inline-block">
                        <QRCodeCanvas
                            id={`qr-modal-${url.url_id}`}
                            value={shortUrl}
                            size={180}
                            level="H"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-2
                        bg-white/5 hover:bg-white/10 border border-white/10
                        text-white/70 hover:text-white text-sm font-medium
                        py-2.5 rounded-xl transition-all"
                    >
                        <Copy size={15} />
                        Copy link
                    </button>
                    <button
                        onClick={() => downloadQR(`qr-modal-${url.url_id}`, `qr-${url.short_code}`)}
                        className="flex-1 flex items-center justify-center gap-2
                        bg-gradient-to-r from-[#4988C4] to-[#6aa8ff]
                        text-white text-sm font-medium
                        py-2.5 rounded-xl shadow-lg shadow-blue-500/30
                        hover:scale-105 transition-all"
                    >
                        <Download size={15} />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRModal;