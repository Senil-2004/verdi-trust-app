import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    Settings,
    LogOut,
    Search,
    Plus,
    MoreVertical,
    Bell,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    Filter,
    ShieldCheck,
    Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    // Mock Data State
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
                    date: new Date(u.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                })));

                const projectsRes = await fetch('/api/projects');
                const projectsData = await projectsRes.json();
                setProjects(projectsData.map(p => ({
                    ...p,
                    dev: p.developer,
                    date: new Date(p.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    color: p.status === 'Approved' ? 'bg-green-500' : p.status === 'Rejected' ? 'bg-red-500' : p.status === 'In Review' ? 'bg-blue-500' : 'bg-yellow-500'
                })));
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            }
        };
        fetchData();
    }, []);

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Project Developer' });
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [showSaveToast, setShowSaveToast] = useState(false);

    // Settings State
    const [platformFee, setPlatformFee] = useState(2.5);
    const [verificationTimeout, setVerificationTimeout] = useState(48);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

    const handleLogout = () => {
        // Clear auth state if any
        navigate('/login');
    };

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
                const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                    let color = 'bg-slate-500';
                    if (status === 'Approved') color = 'bg-green-500';
                    if (status === 'Rejected') color = 'bg-red-500';
                    if (status === 'In Review') color = 'bg-blue-500';
                    return { ...p, status, color };
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
        { label: 'Total Revenue', value: '₹128,430', change: '+12.5%', icon: ArrowUpRight, trend: 'up' },
        { label: 'Active Projects', value: '42', change: '+3', icon: FolderKanban, trend: 'up' },
        { label: 'New Users', value: '156', change: '+18.2%', icon: Users, trend: 'up' },
        { label: 'System Uptime', value: '99.9%', change: 'Stable', icon: CheckCircle2, trend: 'neutral' },
    ];

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-teal-50 transition-colors">
                                    <stat.icon className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                        <div>
                            <CardTitle className="text-xl">Verification Pipeline</CardTitle>
                            <CardDescription>Monitor project approval status</CardDescription>
                        </div>
                        <Button onClick={() => setActiveTab('projects')} variant="outline" size="sm" className="text-xs">View All</Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {projects.map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                        <div>
                                            <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors text-sm">{item.name}</p>
                                            <p className="text-[10px] text-slate-500">{item.region} • {item.dev}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                            item.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                item.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                                                    'bg-blue-50 text-blue-600'
                                            }`}>{item.status}</span>
                                        <div className="flex gap-2">
                                            {item.status === 'Pending' && (
                                                <>
                                                    <Button onClick={() => updateProjectStatus(item.id, 'Approved')} variant="success" size="sm" className="h-7 text-[10px] shadow-none">Approve</Button>
                                                    <Button onClick={() => updateProjectStatus(item.id, 'Rejected')} variant="danger" size="sm" className="h-7 text-[10px] shadow-none">Reject</Button>
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
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500" />
                    <CardHeader>
                        <CardTitle className="text-xl">System Alerts</CardTitle>
                        <CardDescription>Critical updates required</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="flex gap-3 p-4 rounded-xl bg-red-50/50 border border-red-100">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-red-900 leading-none">High Load Warning</p>
                                <p className="text-xs text-red-700 leading-relaxed">Verification processing is currently 25% slower than usual.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                            <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-orange-900 leading-none">Security Patch</p>
                                <p className="text-xs text-orange-700 leading-relaxed">Mandatory security update scheduled for 02:00 AM UTC.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderUsers = () => (
        <Card className="border-none shadow-sm bg-white animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                <div>
                    <CardTitle className="text-2xl">User Management</CardTitle>
                    <CardDescription>Manage platform participants and roles</CardDescription>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                            className="pl-9 w-64 h-10 border-slate-100 bg-slate-50/50"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button variant="primary" className="flex items-center gap-2 h-10 px-5 shadow-teal-500/20">
                                <Plus className="w-4 h-4" /> Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddUser} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <select
                                        id="role"
                                        className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="Project Developer">Project Developer</option>
                                        <option value="Credit Buyer">Credit Buyer</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Create User</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-50 text-xs text-slate-400 uppercase tracking-widest font-bold">
                            <th className="px-8 py-4 text-left">Internal ID</th>
                            <th className="px-8 py-4 text-left">User</th>
                            <th className="px-8 py-4 text-left">Role</th>
                            <th className="px-8 py-4 text-left">Status</th>
                            <th className="px-8 py-4 text-left">Join Date</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users.filter(u =>
                            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.role.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((user, i) => (
                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-4 text-slate-400 font-mono text-xs">{user.id}</td>
                                <td className="px-8 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900 uppercase tracking-wider text-xs">{user.name}</span>
                                        <span className="text-xs text-slate-400">{user.email}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">{user.role}</span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        <span className="text-xs font-bold text-slate-600">{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-xs text-slate-500">{user.date}</td>
                                <td className="px-8 py-4 text-right">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="h-8 text-[10px] px-3 font-bold"
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
        <div className="min-h-screen bg-[#f8fbfa] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Admin<span className="text-teal-600">Core</span></span>
                    </div>

                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                    ? 'bg-teal-50/50 text-teal-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'text-teal-600 scale-110' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110'}`} />
                                <span className={`text-sm font-bold ${activeTab === item.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{item.label}</span>
                                {activeTab === item.id && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-teal-600 rounded-full shadow-[0_0_12px_rgba(20,184,166,0.8)]" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {sidebarItems.find(i => i.id === activeTab)?.label}
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back, Platform Administrator</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />

                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <h4 className="font-bold text-slate-900 mb-4 px-2">Notifications</h4>
                                    <div className="space-y-4">
                                        <div className="flex gap-3 p-3 rounded-xl bg-teal-50/50">
                                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5" />
                                            <p className="text-xs text-slate-600 leading-relaxed font-medium">New project "Amazon Rainforest" requires verification.</p>
                                        </div>
                                        <div className="flex gap-3 p-3 rounded-xl bg-orange-50/50">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
                                            <p className="text-xs text-slate-600 leading-relaxed font-medium">System maintenance scheduled for tonight.</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-teal-600 hover:text-teal-700">Clear All</Button>
                                </div>
                            )}
                        </button>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="flex items-center gap-3 bg-white pr-4 pl-1.5 py-1.5 rounded-full border border-slate-100 shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold ring-4 ring-teal-50 shadow-inner">
                                AD
                            </div>
                            <span className="text-sm font-bold text-slate-900">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Body Content */}
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'projects' && (
                    <Card className="border-none shadow-sm bg-white animate-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                            <div>
                                <CardTitle className="text-2xl">Project Review</CardTitle>
                                <CardDescription>Verify and approve environmental projects</CardDescription>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input
                                        className="pl-9 w-64 h-10 border-slate-100 bg-slate-50/50"
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-50 text-xs text-slate-400 uppercase tracking-widest font-bold">
                                        <th className="px-8 py-4 text-left">Project Name</th>
                                        <th className="px-8 py-4 text-left">Developer</th>
                                        <th className="px-8 py-4 text-left">Region</th>
                                        <th className="px-8 py-4 text-left">Date</th>
                                        <th className="px-8 py-4 text-left">Status</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {projects.filter(p =>
                                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        p.dev.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((project, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-4 font-semibold text-slate-900">{project.name}</td>
                                            <td className="px-8 py-4 text-slate-600">{project.dev}</td>
                                            <td className="px-8 py-4 text-slate-500">{project.region}</td>
                                            <td className="px-8 py-4 text-slate-500">{project.date}</td>
                                            <td className="px-8 py-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${project.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                                    project.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                        project.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                                                            'bg-blue-50 text-blue-600'
                                                    }`}>{project.status}</span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {project.status === 'Pending' ? (
                                                        <>
                                                            <Button onClick={() => updateProjectStatus(project.id, 'Approved')} variant="success" size="sm" className="h-8 font-bold">Approve</Button>
                                                            <Button onClick={() => updateProjectStatus(project.id, 'Rejected')} variant="danger" size="sm" className="h-8 font-bold">Reject</Button>
                                                        </>
                                                    ) : (
                                                        <Button variant="outline" size="sm" className="h-8 opacity-50 cursor-not-allowed" disabled>Resolved</Button>
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
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle>Platform Settings</CardTitle>
                                <CardDescription>Configure core system parameters</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Platform Fee (%)</Label>
                                    <Input
                                        type="number"
                                        value={platformFee}
                                        onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Verification Timeout (Hours)</Label>
                                    <Input
                                        type="number"
                                        value={verificationTimeout}
                                        onChange={(e) => setVerificationTimeout(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                                        <p className="text-xs text-slate-500">Disable project submissions</p>
                                    </div>
                                    <button
                                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                                        className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${maintenanceMode ? 'bg-orange-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${maintenanceMode ? 'left-5' : 'left-1'}`} />
                                    </button>
                                </div>
                                <Button
                                    onClick={() => {
                                        setShowSaveToast(true);
                                        setTimeout(() => setShowSaveToast(false), 3000);
                                    }}
                                    variant="primary"
                                    className="w-full"
                                >
                                    {showSaveToast ? 'Settings Saved Successfully!' : 'Save Parameters'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>Access control and monitoring</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className={`w-5 h-5 ${twoFactorEnabled ? 'text-teal-600' : 'text-slate-400'}`} />
                                        <span className="text-sm font-semibold">2FA Required for Admins</span>
                                    </div>
                                    <button
                                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${twoFactorEnabled ? 'bg-teal-50 text-teal-600 hover:bg-teal-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                            }`}
                                    >
                                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </button>
                                </div>
                                <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between text-slate-400 bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-5 h-5" />
                                        <span className="text-sm font-semibold">IP Whitelist</span>
                                    </div>
                                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">Locked</span>
                                </div>

                                <Dialog open={isAuditLogsOpen} onOpenChange={setIsAuditLogsOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full">View Audit Logs</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>System Audit Logs</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 mt-4 max-h-96 overflow-y-auto pr-2">
                                            {[
                                                { action: 'User Login', user: 'Admin', time: '2 mins ago', status: 'Success' },
                                                { action: 'Project Approved', user: 'Admin', time: '1 hour ago', status: 'Success' },
                                                { action: 'Settings Updated', user: 'Admin', time: '3 hours ago', status: 'Success' },
                                                { action: 'Failed Login', user: 'Unknown', time: '5 hours ago', status: 'Blocked' },
                                            ].map((log, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{log.action}</p>
                                                        <p className="text-xs text-slate-500">By {log.user} • {log.time}</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>{log.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsAuditLogsOpen(false)}>Close</Button>
                                            <Button variant="primary">Download CSV</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'projects' && activeTab !== 'settings' && (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <div className="p-6 bg-slate-100 rounded-full">
                            <Settings className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Under Construction</h3>
                        <p className="text-slate-500">The module is coming soon.</p>
                        <Button onClick={() => setActiveTab('overview')} className="bg-slate-900 text-white hover:bg-slate-800 px-8">Back to Overview</Button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPage;
