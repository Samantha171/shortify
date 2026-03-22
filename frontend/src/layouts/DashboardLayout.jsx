import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
    return (
        <div className="relative flex min-h-screen bg-[#0B1220] text-white overflow-hidden">

            {/* Glow orb top right */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Glow orb bottom left */}
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none z-0" />

            <Sidebar />

            <div className="flex-1 ml-64 min-w-0 flex flex-col overflow-hidden z-10">
                <Topbar />
                <main className="p-6 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;