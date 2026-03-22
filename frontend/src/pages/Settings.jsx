import { useState, useEffect } from 'react';
import {
    User, Mail, Calendar, History, Lock, Eye, EyeOff,
    Trash2, AlertTriangle, Loader2, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { toast } from 'react-toastify';
import ScrollReveal from '../components/ScrollReveal';

const Settings = () => {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await API.get('/auth/me');
            setProfile(data);
        } catch (error) {
            toast.error('Failed to load profile details');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            return toast.error('New passwords do not match');
        }

        if (passwordData.new_password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setPasswordLoading(true);
        try {
            await API.post('/auth/change-password', {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            });
            toast.success('Password updated successfully');
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await API.delete('/auth/delete-account');
            toast.success('Account deleted successfully');
            logout();
        } catch (error) {
            toast.error('Failed to delete account');
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) + ' at ' + date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const cardClass = "group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-400/30 hover:-translate-y-1";
    const labelClass = "text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 block";
    const inputContainerClass = "relative group";
    const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 
        text-white text-sm placeholder-white/20
        focus:outline-none focus:ring-1 focus:ring-[#4988C4]/50 focus:border-[#4988C4]/50
        transition-all duration-200`;

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#4988C4]" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <ScrollReveal>
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Account Settings</h1>
                    <p className="text-white/50">Manage your profile, security, and account preferences.</p>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Information */}
                <ScrollReveal className="space-y-6">
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                                <User className="text-[#6aa8ff]" size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Profile Details</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <User size={16} className="text-white/20" />
                                    <span className="text-white font-medium">{profile?.name}</span>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Email Address</label>
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <Mail size={16} className="text-white/20" />
                                    <span className="text-white font-medium">{profile?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                                <History className="text-green-400" size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Account Activity</h2>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg mt-1">
                                    <Calendar size={14} className="text-white/40" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-white/30 uppercase tracking-tighter">Joined Date</p>
                                    <p className="text-sm font-medium text-white/80">{formatDate(profile?.created_at)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg mt-1">
                                    <ShieldCheck size={14} className="text-[#6aa8ff]" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-white/30 uppercase tracking-tighter">Last Login</p>
                                    <p className="text-sm font-medium text-white/80">{formatDate(profile?.last_login)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Password Management */}
                <ScrollReveal delay={0.1} className="h-full">
                    <div className={`${cardClass} h-full flex flex-col`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                                <Lock className="text-[#6aa8ff]" size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Change Password</h2>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className={labelClass}>Current Password</label>
                                <div className={inputContainerClass}>
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                        className={inputClass}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>New Password</label>
                                <div className={inputContainerClass}>
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        className={inputClass}
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Confirm New Password</label>
                                <div className={inputContainerClass}>
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        value={passwordData.confirm_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                        className={inputClass}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full mt-2 flex items-center justify-center gap-2
                                bg-gradient-to-r from-[#4988C4] to-[#6aa8ff]
                                text-white font-bold py-3 rounded-xl
                                shadow-lg shadow-blue-500/20
                                active:scale-95 transition-all
                                disabled:opacity-50"
                            >
                                {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </ScrollReveal>
            </div>

            {/* Danger Zone */}
            <ScrollReveal delay={0.2}>
                <div className="g-red-500/5 border border-red-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group
hover:shadow-lg hover:shadow-red-500/10 hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <AlertTriangle size={120} className="text-red-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <Trash2 className="text-red-400" size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Danger Zone</h2>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <p className="text-white font-semibold mb-1">Delete Account</p>
                                <p className="text-sm text-white/40 max-w-lg">
                                    Permanently remove your account and all associated short links, QR codes, and analytics data. This action is irreversible.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-xl 
                                font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 shrink-0"
                            >
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#0B1220] border border-white/10 rounded-2xl p-8 text-center shadow-2xl relative">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Wait! Are you sure?</h2>
                        <p className="text-white/50 mb-8">
                            Deleting your account will permanently erase your data and links. This process cannot be undone.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                                className="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl
                                flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deleteLoading ? <Loader2 className="animate-spin" size={20} /> : 'Yes, Delete Everything'}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleteLoading}
                                className="w-full bg-white/5 text-white/60 font-bold py-3.5 rounded-xl
                                hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
