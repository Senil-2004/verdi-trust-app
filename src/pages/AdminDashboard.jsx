import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShieldCheck, Users, AlertCircle, FileText, Settings, BarChart3, Search } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        verificationQueue: 0,
        activeUsers: 0,
        systemStatus: 'Optimal',
        uptime: '99.9%'
    });
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [projectsRes, usersRes] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/users')
            ]);

            const projects = await projectsRes.json();
            const users = await usersRes.json();

            // Filter for pending/in-review projects
            const pendingProjects = projects.filter(p => p.status === 'Pending' || p.status === 'In Review' || p.status === 'Submitted');

            setStats({
                verificationQueue: pendingProjects.length,
                activeUsers: users.length,
                systemStatus: 'Optimal',
                uptime: '99.9%'
            });

            setVerificationRequests(pendingProjects);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id) => {
        try {
            await fetch(`/api/projects/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Approved' })
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Administrator</h1>
                    <p className="text-gray-500 mt-1">Monitor platform health and verify incoming requests.</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2 border-gray-200">
                    <Settings className="w-4 h-4" /> Platform Settings
                </Button>
            </div>

            <div id="portfolio" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Verification Queue", val: stats.verificationQueue, icon: ShieldCheck, sub: `${stats.verificationQueue} pending review`, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Active Users", val: stats.activeUsers.toLocaleString(), icon: Users, sub: "Registered accounts", color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "System Status", val: stats.systemStatus, icon: BarChart3, sub: `${stats.uptime} uptime`, color: "text-green-600", bg: "bg-green-50" },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card id="marketplace" className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Verification Requests</CardTitle>
                            <CardDescription>New projects awaiting platform approval</CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input className="pl-9 pr-4 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50/50 w-64 focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="Search requests..." />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                                        <th className="px-4 py-3 font-medium">Project Name</th>
                                        <th className="px-4 py-3 font-medium">Developer</th>
                                        <th className="px-4 py-3 font-medium">Type</th>
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {verificationRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-400 italic">No pending verification requests.</td>
                                        </tr>
                                    ) : (
                                        verificationRequests.map((row, i) => (
                                            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-4 font-medium text-gray-900">{row.name}</td>
                                                <td className="px-4 py-4 text-gray-500">{row.developer_name || 'Unknown'}</td>
                                                <td className="px-4 py-4 text-gray-500">{row.type}</td>
                                                <td className="px-4 py-4 text-gray-500">{new Date(row.submitted_at || Date.now()).toLocaleDateString()}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" className="h-8 text-xs border-gray-200">Review</Button>
                                                        <Button size="sm" className="h-8 text-xs bg-teal-600" onClick={() => handleApprove(row.id)}>Approve</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div id="analytics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-red-900 uppercase">Critical</p>
                                    <p className="text-xs text-red-800">Verification delay exceeding 48h for {stats.verificationQueue > 0 ? stats.verificationQueue : '0'} projects.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-blue-900 uppercase">Info</p>
                                    <p className="text-xs text-blue-800">New regulatory framework update available in docs.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-600 to-green-600 text-white">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-lg">Platform Growth</h3>
                            <p className="text-sm text-white/80 leading-relaxed">Platform transactions are up 42% this quarter. The current scaling strategy is working.</p>
                            <Button className="w-full bg-white text-teal-700 hover:bg-gray-100 border-0 shadow-lg shadow-black/10">Read Quarter Report</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
