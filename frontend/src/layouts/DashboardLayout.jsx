import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative flex min-h-screen bg-[#0B1220] text-white overflow-hidden">

            {/* Glow orb top right */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Glow orb bottom left */}
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none z-0" />

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 lg:ml-64 min-w-0 flex flex-col overflow-hidden z-10 transition-all duration-300">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="p-4 md:p-6 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;