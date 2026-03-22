import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';
import { User, Mail, Shield, LogOut, Trash2 } from 'lucide-react';

const Settings = () => {
    const { user, logout } = useAuth();

    return (
        <div className="space-y-8">
            <ScrollReveal>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Account Settings</h1>
                    <p className="text-gray-400">Manage your profile and security preferences.</p>
                </div>
            </ScrollReveal>

            <ScrollReveal className="max-w-2xl bg-shortify-card rounded-3xl p-10 border border-shortify-card/50 shadow-2xl">
                <div className="flex items-center space-x-6 mb-12">
                    <div className="w-24 h-24 bg-shortify-btn rounded-3xl flex items-center justify-center text-white ring-4 ring-shortify-highlight/20 border-4 border-shortify-bg">
                        <User size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black">{user?.name}</h2>
                        <p className="text-shortify-highlight font-medium">Standard Plan User</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between py-4 border-b border-shortify-card/50">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-shortify-bg rounded-xl flex items-center justify-center">
                                <Mail className="text-gray-500" size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</p>
                                <p className="text-sm font-medium mt-1">{user?.email}</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-shortify-btn hover:underline uppercase">Change</button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-shortify-card/50">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-shortify-bg rounded-xl flex items-center justify-center">
                                <Shield className="text-gray-500" size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Security</p>
                                <p className="text-sm font-medium mt-1">Multi-factor Authentication</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-shortify-bg border border-shortify-card rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row gap-4">
                        <button 
                            onClick={logout}
                            className="flex-1 bg-shortify-bg border border-shortify-card text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-2 transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                        <button className="flex-1 bg-red-500/10 border border-red-500/30 text-red-500 py-4 rounded-2xl font-black flex items-center justify-center space-x-2 transition-all hover:bg-red-500 hover:text-white">
                            <Trash2 size={20} />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>
            </ScrollReveal>
            
            <ScrollReveal className="max-w-2xl p-6 bg-shortify-highlight/5 border border-shortify-highlight/20 rounded-2xl flex items-center space-x-4">
                 <Shield className="text-shortify-highlight shrink-0" size={24} />
                 <p className="text-sm text-gray-400">
                    Your account is secured with 256-bit encryption. We never share your original URLs or tracking data with third parties.
                 </p>
            </ScrollReveal>
        </div>
    );
};

export default Settings;
