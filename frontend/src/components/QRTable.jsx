import { Copy, Download, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-toastify';

const QRTable = ({ urls }) => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast('Link copied', { icon: <LinkIcon size={16} className="text-[#6aa8ff]" /> });
    };

    const downloadQR = (id, shortCode) => {
        const canvas = document.getElementById(`qr-${id}`);
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-${shortCode}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const baseUrl = 'https://shortify-backend-ch6j.onrender.com/r/';

    return (
        <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-shortify-card/50">
                        <th className="px-6 py-4 font-semibold">Short URL</th>
                        <th className="px-6 py-4 font-semibold">QR Code</th>
                        <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-shortify-card/30">
                    {urls.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="px-6 py-20 text-center text-gray-500">No links found. QR codes will appear here as soon as you create a link.</td>
                        </tr>
                    ) : (
                        urls.map((url) => (
                            <tr key={url.url_id} className="hover:bg-shortify-bg/40 transition-colors group">
                                <td className="px-6 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-shortify-highlight font-mono mb-1">{baseUrl}{url.short_code}</span>
                                        <span className="text-xs text-gray-500 truncate max-w-xs">{url.original_url}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-8">
                                    <div className="bg-white p-2 rounded-xl inline-block shadow-lg">
                                        <QRCodeCanvas
                                            id={`qr-${url.url_id}`}
                                            value={`${baseUrl}${url.short_code}`}
                                            size={80}
                                            level={"H"}
                                            includeMargin={false}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-8">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => copyToClipboard(`${baseUrl}${url.short_code}`)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-shortify-bg border border-shortify-card rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-shortify-card/50 transition-all"
                                        >
                                            <Copy size={16} />
                                            <span>Copy</span>
                                        </button>
                                        <button
                                            onClick={() => downloadQR(url.url_id, url.short_code)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-shortify-btn/10 border border-shortify-btn/30 rounded-xl text-sm font-medium text-shortify-highlight hover:bg-shortify-btn/20 transition-all"
                                        >
                                            <Download size={16} />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default QRTable;
