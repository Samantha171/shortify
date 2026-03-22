import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

const Topbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/8 
        flex items-center justify-end px-8 sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-white/40">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center
                bg-gradient-to-br from-[#4988C4] to-[#6aa8ff] shadow-lg shadow-blue-500/30">
                    <User size={18} className="text-white" />
                </div>
            </div>
        </header>
    );
};

export default Topbar;