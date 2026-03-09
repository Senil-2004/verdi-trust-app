import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, Bell, User, Mail, Shield, Calendar, MapPin, Building2, Globe, Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { CardDescription } from '../components/ui/card';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { supabase } from '../lib/supabase';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);
            if (error) throw error;
            setNotifications((data || []).map(n => ({
                ...n,
                read: n.is_read,
                time: getRelativeTime(new Date(n.created_at))
            })));
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const fetchUserProfile = async () => {
        const email = localStorage.getItem('userEmail');
        if (!email) return;

        try {
            const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
            if (data) {
                setUserProfile(data);
                if (data.name) {
                    localStorage.setItem('userName', data.name);
                }

                // Hard lock sellers into the seller perspective
                const isSellerRole = data.role === 'Project Developer' || data.role === 'seller';
                if (isSellerRole) {
                    localStorage.setItem('isSeller', 'true');
                    if (location.pathname.includes('/buyer')) {
                        console.warn("User is a seller. Redirecting from buyer dashboard.");
                        navigate('/seller', { replace: true });
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUserProfile();

        // Real-time subscription: auto-refresh bell when any new notification is inserted
        const channel = supabase
            .channel('realtime:notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => {
                    const n = payload.new;
                    setNotifications(prev => [{
                        ...n,
                        read: n.is_read,
                        time: 'Just now'
                    }, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [location.pathname]);

    const markAllAsRead = async () => {
        try {
            const { error } = await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
            if (error) throw error;
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getRoleLabel = () => {
        const path = location.pathname;
        if (path.includes('/admin')) return 'Platform Administrator';
        if (path.includes('/buyer')) return 'Sovereign Buyer';
        if (path.includes('/seller')) return 'Asset Provider';
        if (path.includes('/verifier')) return 'Verifier';
        if (path.includes('/developer') || path.includes('/project-developer')) return 'Project Developer';
        return 'Standard User';
    };

    return (
        <div className="min-h-screen bg-[#080c0a] text-slate-200 flex flex-col font-['Outfit'] overflow-x-hidden">
            {/* Top Navigation */}
            <header className="h-16 glass-morphism sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 sm:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#080c0a]" />
                        </div>
                        <span className="text-lg sm:text-2xl font-black text-white tracking-tight">VerdiTrust</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-6">


                    <div className="flex items-center gap-5">
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-emerald-400 hover:bg-white/10 transition-all relative"
                            >
                                <Bell className="w-5 h-5" />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#080c0a]"></span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute right-[-60px] sm:right-0 mt-4 w-[280px] sm:w-80 glass-morphism-heavy rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                    <div className="p-4 sm:p-5 border-b border-white/5 flex justify-between items-center">
                                        <h3 className="font-black text-white text-sm">Notifications</h3>
                                        <button onClick={markAllAsRead} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider">
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                                <p className="text-xs text-slate-500 font-medium">No new notifications</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-white/5">
                                                {notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer group ${!n.read ? 'bg-emerald-500/5' : ''}`}
                                                        onClick={async () => {
                                                            if (!n.read) {
                                                                await supabase.from('notifications').update({ is_read: true }).eq('id', n.id);
                                                                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-xs ${!n.read ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>{n.title}</p>
                                                                {n.message && (
                                                                    <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                                                                )}
                                                                <p className="text-[10px] text-slate-600 mt-1.5 font-black uppercase tracking-wider">{n.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-white/5">
                                        <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                                            View All Activity
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-10 w-[1px] bg-white/10 mx-2"></div>

                        <div
                            className="flex items-center gap-2 sm:gap-4 pl-1 sm:pl-2 cursor-pointer group hover:bg-white/5 p-1 rounded-2xl transition-all"
                            onClick={() => setIsProfileOpen(true)}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-white leading-none mb-1 group-hover:text-emerald-400 transition-colors">
                                    {userProfile?.name || localStorage.getItem('userName') || 'Gregory'}
                                </p>
                                <div className="flex items-center justify-end gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                                        {getRoleLabel()}
                                    </p>
                                </div>
                            </div>
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-base sm:text-lg shadow-inner group-hover:scale-110 transition-transform">
                                {(userProfile?.name || localStorage.getItem('userName') || 'Gregory')[0].toUpperCase()}
                            </div>
                        </div>

                        {/* Profile Dialog */}
                        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                            <DialogContent className="max-w-md bg-[#080c0a] border border-white/10 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
                                <div className="relative h-32 bg-gradient-to-r from-emerald-600 to-teal-600">
                                    <div className="absolute -bottom-12 left-10 p-1.5 bg-[#080c0a] rounded-3xl border border-white/10">
                                        <div className="w-24 h-24 rounded-[1.25rem] bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                                            {(userProfile?.name || localStorage.getItem('userName') || 'Gregory')[0].toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-16 px-10 pb-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-white">{userProfile?.name || localStorage.getItem('userName') || 'Gregory'}</h2>
                                            <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                                <Shield className="w-3 h-3" />
                                                Verified {getRoleLabel()}
                                            </p>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Status: {userProfile?.status || 'Active'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { icon: Mail, label: 'Email Address', value: localStorage.getItem('userEmail') || 'N/A' },
                                                { icon: Shield, label: 'Access Level', value: getRoleLabel() },
                                                { icon: Calendar, label: 'Member Since', value: userProfile?.joined_at ? new Date(userProfile.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Jan 2024' },
                                                { icon: Globe, label: 'Global Registry ID', value: `VT-${Math.random().toString(36).substr(2, 9).toUpperCase()}` }
                                            ].map((item, i) => (
                                                <div key={i} className="flex flex-col gap-1.5 p-4 bg-white/5 border border-white/5 rounded-2xl group/item hover:bg-white/10 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <item.icon className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-emerald-400 transition-colors" />
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                                    </div>
                                                    <p className="text-sm font-black text-white pl-5.5">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="px-10 pb-10 pt-0 bg-transparent flex justify-normal">
                                    <Button
                                        onClick={() => setIsProfileOpen(false)}
                                        className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all"
                                    >
                                        Close Profile Registry
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] sm:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#080c0a] border-r border-white/5 p-6 animate-in slide-in-from-left duration-300">
                        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                                <Leaf className="w-5 h-5 text-[#080c0a]" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">VerdiTrust</span>
                        </div>

                        <nav className="space-y-4">
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 text-white font-bold"
                            >
                                <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                                Explore Market
                            </Link>
                            {/* Role based links could go here */}
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); setIsProfileOpen(true); }}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 text-slate-400"
                            >
                                <User className="w-5 h-5" />
                                Profile Details
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-rose-500/10 text-rose-500 mt-auto"
                            >
                                <LogOut className="w-5 h-5" />
                                Terminate Session
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1">
                <div className="relative">
                    {/* Background decorative elements */}
                    <div className="fixed top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                    <div className="fixed bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
