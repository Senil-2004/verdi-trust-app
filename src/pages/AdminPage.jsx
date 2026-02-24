import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    Settings,
    Search,
    Plus,
    Clock,
    AlertCircle,
    ShieldCheck,
    Lock,
    Activity,
    TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    // Data State
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await fetch('/api/users');
                const usersData = await usersRes.json();
                setUsers(usersData.map(u => ({
                    ...u,
                    id: '#' + u.id,
                    date: new Date(u.joined_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                })));

                const projectsRes = await fetch('/api/projects');
                const projectsData = await projectsRes.json();
                setProjects(projectsData.map(p => ({
                    ...p,
                    dev: p.developer,
                    date: new Date(p.submitted_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
                    statusColor: p.status === 'Approved' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        p.status === 'Rejected' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                            p.status === 'In Review' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                                'text-amber-400 bg-amber-500/10 border-amber-500/20'
                })));
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            }
        };
        fetchData();
    }, []);

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Project Developer' });
    const [showSaveToast, setShowSaveToast] = useState(false);

    // Settings State
    const [platformFee, setPlatformFee] = useState(2.5);
    const [verificationTimeout, setVerificationTimeout] = useState(48);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                const created = await res.json();
                const date = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                setUsers([...users, { ...created, id: '#' + created.id, date }]);
                setNewUser({ name: '', email: '', role: 'Project Developer' });
                setIsAddUserOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (id) => {
        try {
            const realId = id.replace('#', '');
            await fetch(`/api/users/${realId}`, { method: 'DELETE' });
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const updateProjectStatus = async (id, status) => {
        try {
            await fetch(`/api/projects/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setProjects(projects.map(p => {
                if (p.id === id) {
                    let statusColor = 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                    if (status === 'Approved') statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    if (status === 'Rejected') statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                    if (status === 'In Review') statusColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
                    return { ...p, status, statusColor };
                }
                return p;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'projects', label: 'Review Projects', icon: FolderKanban },
        { id: 'settings', label: 'System Settings', icon: Settings },
    ];

    const stats = [
        { label: 'Total Revenue', value: '₹1,28,430', change: '+12.5%', icon: TrendingUp, trend: 'up', color: 'text-emerald-400' },
        { label: 'Active Projects', value: '42', change: '+3', icon: Activity, trend: 'up', color: 'text-blue-400' },
        { label: 'New Users', value: '156', change: '+18.2%', icon: Users, trend: 'up', color: 'text-amber-400' },
        { label: 'System Uptime', value: '99.9%', change: 'Stable', icon: ShieldCheck, trend: 'neutral', color: 'text-teal-400' },
    ];

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none glass-morphism hover:scale-[1.02] transition-all duration-300 cursor-default group overflow-hidden">
                        <CardContent className="p-6 relative">
                            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.color} opacity-[0.05] rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.color} bg-opacity-10 border border-current transition-colors`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                <p className="text-3xl font-black text-white mt-2 tracking-tight">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 border-none glass-morphism">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <CardTitle className="text-xl font-black text-white tracking-tight">Verification Pipeline</CardTitle>
                            <CardDescription className="text-slate-500 font-medium">Monitor project approval status</CardDescription>
                        </div>
                        <Button onClick={() => setActiveTab('projects')} variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10">View All</Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {projects.slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-default p-3 hover:bg-white/5 rounded-2xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${item.statusColor} bg-opacity-10`}>
                                            <FolderKanban className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors text-sm tracking-tight">{item.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.region} • {item.dev}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${item.statusColor}`}>
                                            {item.status}
                                        </span>
                                        <div className="flex gap-2">
                                            {item.status === 'Pending' && (
                                                <>
                                                    <Button onClick={() => updateProjectStatus(item.id, 'Approved')} size="sm" className="h-7 text-[9px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-[#080c0a] border border-emerald-500/20 font-black uppercase tracking-widest">Approve</Button>
                                                    <Button onClick={() => updateProjectStatus(item.id, 'Rejected')} size="sm" className="h-7 text-[9px] bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 font-black uppercase tracking-widest">Reject</Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Alerts */}
                <Card className="border-none glass-morphism overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-white tracking-tight">System Alerts</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Critical updates required</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="flex gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-xs font-black text-rose-400 uppercase tracking-widest">High Load Warning</p>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">Verification processing is currently 25% slower than usual.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                            <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-xs font-black text-amber-400 uppercase tracking-widest">Security Patch</p>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">Mandatory security update scheduled for 02:00 AM UTC.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderUsers = () => (
        <Card className="border-none glass-morphism animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6">
                <div>
                    <CardTitle className="text-3xl font-black text-white tracking-tight">User Management.</CardTitle>
                    <CardDescription className="text-slate-500 font-medium mt-2">Manage platform participants and roles</CardDescription>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input
                            className="pl-11 h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-emerald-500/20 font-medium"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-[#080c0a] font-black rounded-xl shadow-lg shadow-emerald-500/20">
                                <Plus className="w-4 h-4 mr-2" /> Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-morphism-heavy border-white/10 text-white rounded-3xl overflow-y-auto max-h-[90vh] scrollbar-hide">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Add New User</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddUser} className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</Label>
                                    <Input
                                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                                        required
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</Label>
                                    <Input
                                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Role</Label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border border-white/10 bg-[#0c1210] text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="Project Developer">Project Developer</option>
                                        <option value="Credit Buyer">Credit Buyer</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsAddUserOpen(false)} className="h-12 rounded-xl text-slate-400 hover:text-white">Cancel</Button>
                                    <Button type="submit" className="h-12 rounded-xl bg-emerald-500 text-[#080c0a] font-black hover:bg-emerald-400">Create User</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
                            <th className="px-8 py-6 text-left">Internal ID</th>
                            <th className="px-8 py-6 text-left">User</th>
                            <th className="px-8 py-6 text-left">Role</th>
                            <th className="px-8 py-6 text-left">Status</th>
                            <th className="px-8 py-6 text-left">Join Date</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users.filter(u =>
                            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.role.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((user, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-6 text-slate-500 font-mono text-xs">{user.id}</td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white uppercase tracking-tight text-sm">{user.name}</span>
                                        <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/5 rounded-lg text-slate-300 border border-white/5">{user.role}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                                        <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-xs text-slate-500 font-bold uppercase tracking-wider">{user.date}</td>
                                <td className="px-8 py-6 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-[10px] px-4 font-black text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white uppercase tracking-widest transition-all rounded-lg"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );

    return (
        <div className="flex min-h-screen bg-[#080c0a] text-slate-300 font-['Outfit']">
            {/* Sidebar Styling adjusted for DashboardLayout context */}
            <aside className="w-64 glass-morphism border-r border-white/5 flex flex-col fixed top-16 bottom-0 z-40">
                <div className="p-6">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 px-4">Admin Console</p>
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                {activeTab === item.id && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        {sidebarItems.find(i => i.id === activeTab)?.label}.
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium text-lg">Platform oversight and configuration</p>
                </header>

                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'projects' && (
                    <Card className="border-none glass-morphism animate-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                            <div>
                                <CardTitle className="text-3xl font-black text-white tracking-tight">Project Review.</CardTitle>
                                <CardDescription className="text-slate-500 font-medium mt-2">Verify and approve environmental projects</CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                <Input
                                    className="pl-11 h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-emerald-500/20 font-medium"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
                                        <th className="px-8 py-6 text-left">Project Name</th>
                                        <th className="px-8 py-6 text-left">Developer</th>
                                        <th className="px-8 py-6 text-left">Region</th>
                                        <th className="px-8 py-6 text-left">Date</th>
                                        <th className="px-8 py-6 text-left">Status</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {projects.filter(p =>
                                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        p.dev.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((project, i) => (
                                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6 font-bold text-white text-sm">{project.name}</td>
                                            <td className="px-8 py-6 text-slate-400 font-medium">{project.dev}</td>
                                            <td className="px-8 py-6 text-slate-500 uppercase tracking-wider text-xs font-bold">{project.region}</td>
                                            <td className="px-8 py-6 text-slate-500 font-mono text-xs">{project.date}</td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${project.statusColor}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {project.status === 'Pending' ? (
                                                        <>
                                                            <Button onClick={() => updateProjectStatus(project.id, 'Approved')} size="sm" className="h-8 font-black uppercase tracking-widest text-[10px] bg-emerald-500 text-[#080c0a] hover:bg-emerald-400">Approve</Button>
                                                            <Button onClick={() => updateProjectStatus(project.id, 'Rejected')} size="sm" className="h-8 font-black uppercase tracking-widest text-[10px] bg-white/5 text-slate-400 hover:text-white hover:bg-rose-500">Reject</Button>
                                                        </>
                                                    ) : (
                                                        <Button variant="outline" size="sm" className="h-8 opacity-30 cursor-not-allowed bg-transparent border-white/10 text-slate-500 font-black text-[10px] uppercase tracking-widest" disabled>Resolved</Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        <Card className="border-none glass-morphism">
                            <CardHeader>
                                <CardTitle className="text-2xl font-black text-white">Platform Settings</CardTitle>
                                <CardDescription className="text-slate-500">Configure core system parameters</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Platform Fee (%)</Label>
                                    <Input
                                        className="h-14 bg-white/5 border-white/10 text-white rounded-xl text-lg font-bold"
                                        type="number"
                                        value={platformFee}
                                        onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Verification Timeout (Hours)</Label>
                                    <Input
                                        className="h-14 bg-white/5 border-white/10 text-white rounded-xl text-lg font-bold"
                                        type="number"
                                        value={verificationTimeout}
                                        onChange={(e) => setVerificationTimeout(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-wider">Maintenance Mode</p>
                                        <p className="text-xs text-slate-500 mt-1">Disable project submissions</p>
                                    </div>
                                    <button
                                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                                        className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${maintenanceMode ? 'bg-amber-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${maintenanceMode ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                <Button
                                    onClick={() => {
                                        setShowSaveToast(true);
                                        setTimeout(() => setShowSaveToast(false), 3000);
                                    }}
                                    className="w-full h-14 bg-emerald-500 text-[#080c0a] font-black rounded-xl uppercase tracking-widest hover:bg-emerald-400"
                                >
                                    {showSaveToast ? 'Settings Saved Successfully!' : 'Save Parameters'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none glass-morphism">
                            <CardHeader>
                                <CardTitle className="text-2xl font-black text-white">Security</CardTitle>
                                <CardDescription className="text-slate-500">Access control and monitoring</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-5 border border-white/10 rounded-2xl flex items-center justify-between bg-white/5">
                                    <div className="flex items-center gap-4">
                                        <ShieldCheck className={`w-6 h-6 ${twoFactorEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                                        <span className="text-sm font-bold text-white">2FA Required for Admins</span>
                                    </div>
                                    <button
                                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-colors ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-500'}`}
                                    >
                                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </button>
                                </div>
                                <div className="p-5 border border-white/10 rounded-2xl flex items-center justify-between bg-white/5 opacity-50">
                                    <div className="flex items-center gap-4">
                                        <Lock className="w-6 h-6 text-slate-400" />
                                        <span className="text-sm font-bold text-white">IP Whitelist</span>
                                    </div>
                                    <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-lg text-slate-300 uppercase tracking-widest">Locked</span>
                                </div>

                                <Dialog open={isAuditLogsOpen} onOpenChange={setIsAuditLogsOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full h-14 border-white/10 hover:bg-white/5 text-slate-300 font-bold uppercase tracking-widest rounded-xl">View Audit Logs</Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass-morphism-heavy border-white/10 text-white rounded-3xl max-w-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black">System Audit Logs</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto pr-2">
                                            {[
                                                { action: 'User Login', user: 'Admin', time: '2 mins ago', status: 'Success' },
                                                { action: 'Project Approved', user: 'Admin', time: '1 hour ago', status: 'Success' },
                                                { action: 'Settings Updated', user: 'Admin', time: '3 hours ago', status: 'Success' },
                                                { action: 'Failed Login', user: 'Unknown', time: '5 hours ago', status: 'Blocked' },
                                            ].map((log, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{log.action}</p>
                                                        <p className="text-xs text-slate-500 font-medium">By {log.user} • {log.time}</p>
                                                    </div>
                                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <DialogFooter>
                                            <Button variant="ghost" onClick={() => setIsAuditLogsOpen(false)} className="text-slate-400 hover:text-white rounded-xl">Close</Button>
                                            <Button className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl">Download CSV</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPage;
