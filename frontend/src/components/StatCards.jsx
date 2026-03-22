import { Link2, MousePointer2, Activity } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const StatCards = ({ totalLinks, totalClicks, activeLinks }) => {
    const stats = [
        { name: 'Total Links', value: totalLinks, icon: Link2, color: 'text-[#6aa8ff]', bg: 'bg-[#4988C4]/10' },
        { name: 'Total Clicks', value: totalClicks, icon: MousePointer2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { name: 'Active Links', value: activeLinks, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((item) => (
                <Tilt key={item.name} tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false} transitionSpeed={2500}>
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 rounded-2xl p-5 flex items-center gap-4 h-full">
                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={item.color} size={22} />
                    </div>
                    <div>
                        <p className="text-white/40 text-xs font-medium">{item.name}</p>
                        <h3 className="text-2xl font-bold text-white mt-0.5">{item.value ?? 0}</h3>
                    </div>
                    </div>
                </Tilt>
            ))}
        </div>
    );
};

export default StatCards;