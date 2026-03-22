import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const Expired = () => {
    return (
        <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Clock size={28} className="text-amber-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Link has expired</h1>
                <p className="text-white/40 text-sm mb-6">This link is no longer active.</p>
                <Link
                    to="/"
                    className="px-5 py-2.5 rounded-xl text-sm font-medium
                    bg-gradient-to-r from-[#4988C4] to-[#6aa8ff] text-white
                    shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
                >
                    Go to homepage
                </Link>
            </div>
        </div>
    );
};

export default Expired;