import { Clock } from 'lucide-react';

const VisitList = ({ visits }) => {
    return (
        <div className="space-y-4">
            {visits.length === 0 ? (
                <p className="text-gray-500 text-sm">No visits yet. Share your short link to start tracking!</p>
            ) : (
                visits.map((visit) => (
                    <div key={visit.visit_id} className="flex items-center justify-between p-4 bg-shortify-bg/50 border border-shortify-card/30 rounded-2xl hover:bg-shortify-bg/80 transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-shortify-btn/20 rounded-xl flex items-center justify-center">
                                <Clock className="text-shortify-btn" size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">User Visited Link</p>
                                <p className="text-xs text-gray-500">{new Date(visit.visited_at).toLocaleDateString()} at {new Date(visit.visited_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <div className="text-xs font-bold text-shortify-highlight bg-shortify-highlight/10 px-3 py-1 rounded-full uppercase">
                            Direct
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default VisitList;
