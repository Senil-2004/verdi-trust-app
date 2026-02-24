import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, Bell, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            setNotifications(data.map(n => ({
                ...n,
                read: n.is_read, // Map DB snake_case to camelCase if needed, or keep consistent
                time: new Date(n.created_at).toLocaleDateString() // Simple formatting
            })));
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/read', { method: 'PUT' });
            // Optimistically update UI
            setNotifications(notifications.map(n => ({ ...n, read: 1 })));
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
        <div className="min-h-screen bg-[#080c0a] text-slate-200 flex flex-col font-['Outfit']">
            {/* Top Navigation */}
            <header className="h-16 glass-morphism sticky top-0 z-50 flex items-center justify-between px-6 border-b border-white/5">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                        <Leaf className="w-6 h-6 text-[#080c0a]" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">VerdiTrust</span>
                </Link>

                <div className="flex items-center gap-6">


                    <div className="flex items-center gap-5">
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-emerald-400 hover:bg-white/10 transition-all relative"
                            >
                                <Bell className="w-5 h-5" />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#080c0a]"></span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-4 w-80 glass-morphism-heavy rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                    <div className="p-5 border-b border-white/5 flex justify-between items-center">
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
                                                    <div key={n.id} className={`p-4 hover:bg-white/5 transition-colors cursor-pointer group ${!n.read ? 'bg-emerald-500/5' : ''}`}>
                                                        <div className="flex gap-3">
                                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                                            <div>
                                                                <p className={`text-xs ${!n.read ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>{n.title}</p>
                                                                <p className="text-[10px] text-slate-500 mt-1">{n.time}</p>
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

                        <div className="flex items-center gap-4 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-white leading-none mb-1">
                                    {localStorage.getItem('userName') || 'User'}
                                </p>
                                <div className="flex items-center justify-end gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                                        {getRoleLabel()}
                                    </p>
                                </div>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg shadow-inner">
                                {localStorage.getItem('userName')?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="ml-4 p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

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
