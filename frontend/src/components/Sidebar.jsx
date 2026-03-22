import { Link, useLocation } from 'react-router-dom';
import { Home, Link2, QrCode, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Home', icon: Home, path: '/home' },
        { name: 'Links', icon: Link2, path: '/links' },
        { name: 'QR Codes', icon: QrCode, path: '/qr' },
        { name: 'Analytics', icon: BarChart2, path: '/analytics' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col
        bg-[#0B1220]/80 backdrop-blur-xl border-r border-white/8 z-20">

            {/* Logo */}
            <div className="p-6 border-b border-white/8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4988C4] to-[#6aa8ff]
                    flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Link2 size={14} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Shortify</h1>
                        <p className="text-xs text-white/40">Smart Links</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-4 space-y-1 px-3">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-[#4988C4]/20 text-white border border-[#4988C4]/30'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon
                                size={18}
                                className={isActive ? 'text-[#6aa8ff]' : 'text-white/40'}
                            />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/8">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 text-white/40 hover:text-red-400
                    hover:bg-red-500/10 rounded-xl px-4 py-2.5 transition-all w-full"
                >
                    <LogOut size={16} />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;