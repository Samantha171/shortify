import { useState, useEffect } from 'react';
import API from '../services/api';
import QRTable from '../components/QRTable';
import ScrollReveal from '../components/ScrollReveal';

const QR = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data } = await API.get('/urls?qr_generated=true');
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">QR Codes</h1>
                <p className="text-white/40 text-sm mt-1">
                    QR codes you have generated for your short links.
                </p>
            </div>

            <ScrollReveal className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <div className="w-8 h-8 border-2 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : urls.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-white/30 text-sm">No QR codes generated yet.</p>
                        <p className="text-white/20 text-xs mt-2">
                            Go to Links page and click the QR icon on any link.
                        </p>
                    </div>
                ) : (
                    <QRTable urls={urls} />
                )}
            </ScrollReveal>
        </div>
    );
};

export default QR;