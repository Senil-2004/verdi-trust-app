import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    LayoutDashboard,
    Leaf,
    Database,
    ArrowUpRight,
    Plus,
    CheckCircle2,
    Clock,
    X,
    UploadCloud,
    TrendingUp,
    ShieldCheck,
    MapPin,
    FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="border-none glass-morphism hover:scale-[1.02] transition-all duration-500 cursor-default group overflow-hidden">
        <CardContent className="p-8 relative">
            <div className="absolute -right-4 -top-4 w-32 h-32 text-teal-500 opacity-[0.03] rounded-full blur-3xl group-hover:opacity-10 transition-opacity" />
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">{title}</p>
                <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
                    {trend === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500/50" />}
                </div>
            </div>
        </CardContent>
    </Card>
);

const DeveloperDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', location: '', type: 'Reforestation' });
    const [actionStatus, setActionStatus] = useState({ type: '', id: null, active: false });
    const [reviewListings, setReviewListings] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await fetch('/api/listings');
                const data = await res.json();

                // Map database listings to the activity feed
                const mappedProjects = data.map(l => ({
                    id: l.id,
                    name: l.project_source,
                    status: l.status === 'In Review' ? 'Verifying' : l.status === 'Active' ? 'Verified' : l.status,
                    rawDate: l.created_at || new Date().toISOString(),
                    date: l.created_at ? new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Just now",
                    credits: l.status === 'Active' ? `+${l.volume.toLocaleString()}` : "Pending",
                    color: l.status === 'Active' ? "text-emerald-400" : l.status === 'In Review' ? "text-amber-400" : "text-rose-400",
                    border: l.status === 'Active' ? "border-emerald-500/20" : l.status === 'In Review' ? "border-amber-500/20" : "border-rose-500/20",
                    bg: l.status === 'Active' ? "bg-emerald-500/10" : l.status === 'In Review' ? "bg-amber-500/10" : "bg-rose-500/10"
                }));
                setProjects(mappedProjects);

                // Extract listings that need verification
                setReviewListings(data.filter(l => l.status === 'In Review'));
            } catch (err) {
                console.error("Dashboard sync error:", err);
            }
        };
        fetchAllData();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            const res = await fetch(`/api/listings/${id}/verify`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                runAction(status === 'Active' ? 'verify' : 'reject', `Listing ${status === 'Active' ? 'Approved' : 'Rejected'}`);
                window.location.reload(); // Hard refresh to sync all views
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const project = {
            id: projects.length + 1,
            name: newProject.name,
            status: "In Review",
            date: "Just now",
            credits: "Pending",
            color: "text-blue-400",
            border: "border-blue-500/20",
            bg: "bg-blue-500/10"
        };
        setProjects([project, ...projects]);
        setIsRegisterOpen(false);
        setNewProject({ name: '', location: '', type: 'Reforestation' });
        runAction('register', 'Project registration');
    };

    const runAction = (type, label) => {
        setActionStatus({ type: label, id: Date.now(), active: true });
        setTimeout(() => setActionStatus({ type: '', id: null, active: false }), 3000);
    };

    return (
        <div className="p-12 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000">
            {/* Action Toast */}
            {actionStatus.active && (
                <div className="fixed bottom-12 right-12 z-50 animate-in slide-in-from-right-10">
                    <div className="glass-morphism-heavy px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-black text-white uppercase tracking-widest">{actionStatus.type} successful!</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-teal-500/10 rounded-full blur-[60px] -z-10" />
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="glass-morphism text-teal-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-teal-500/20">Asset Issuance</span>
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Global Protocol V.4.2</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tight leading-[1.1]">
                        Issuance <span className="premium-gradient-text text-teal-400">Command.</span>
                    </h1>
                    <p className="text-slate-400 mt-4 font-medium text-lg max-w-xl">Architecting high-fidelity environmental assets and managing global credit lifecycles.</p>
                </div>


            </div>

            <div id="portfolio" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Active Protocols" value={projects.filter(p => p.status === 'Verified').length} change="" icon={LayoutDashboard} trend="up" />
                <StatCard title="Issuance Volume" value={projects.filter(p => p.status === 'Verified').reduce((sum, p) => sum + parseInt(p.credits.replace('+', '') || 0), 0).toLocaleString()} change="" icon={Leaf} trend="up" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card id="marketplace" className="lg:col-span-2 border-none glass-morphism overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="border-b border-white/5 pb-8 px-10 pt-10 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-white">Project Activity</CardTitle>
                            <CardDescription className="text-slate-500 font-medium font-medium">Real-time status of your environmental asset issuance</CardDescription>
                        </div>

                    </CardHeader>
                    <CardContent className="px-10 py-10">
                        <div className="space-y-8">
                            {projects.map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl ${item.bg} border ${item.border} group-hover:scale-110 transition-transform duration-500`}>
                                            <ShieldCheck className={`w-6 h-6 ${item.color}`} />
                                        </div>
                                        <div>
                                            <p className="font-black text-white group-hover:text-teal-400 transition-colors uppercase tracking-tight text-base">{item.name}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-600" />
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            {item.status === 'Verifying' ? (
                                                <Button
                                                    size="sm"
                                                    className="h-10 px-6 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                                    onClick={() => handleVerify(item.id, 'Active')}
                                                >
                                                    Authorize
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col items-end">
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${item.border} ${item.bg} ${item.color}`}>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                        {item.status}
                                                    </div>
                                                    <p className="text-xs font-black text-slate-500 mt-2">{item.credits} <span className="text-[10px] opacity-50 ml-1">tCO2e</span></p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Verification Queue Redesign */}
                {reviewListings.length > 0 && (
                    <Card id="analytics" className="lg:col-span-full border-none glass-morphism overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="bg-slate-900/50 border-b border-white/5 p-12">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Market Verification Protocol</span>
                                    </div>
                                    <CardTitle className="text-4xl font-black text-white">Issuance Pipeline</CardTitle>
                                    <CardDescription className="text-slate-500 text-lg font-medium mt-2">Final validation of institutional carbon credit offerings</CardDescription>
                                </div>
                                <div className="text-right glass-morphism px-8 py-6 rounded-3xl border border-white/10">
                                    <p className="text-5xl font-black premium-gradient-text">{reviewListings.length}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Active Filings</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                            <th className="px-12 py-8 text-left">Filing Identifier</th>
                                            <th className="px-12 py-8 text-left">Asset Source</th>
                                            <th className="px-12 py-8 text-left">Pricing Models</th>
                                            <th className="px-12 py-8 text-left">Compliance Docs</th>
                                            <th className="px-12 py-8 text-right">Issuance Authority</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {reviewListings.map((l) => (
                                            <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group cursor-default">
                                                <td className="px-12 py-10">
                                                    <span className="text-xs font-mono font-black text-slate-500 bg-white/5 px-2 py-1 rounded-md">#ASSET-{l.id}</span>
                                                </td>
                                                <td className="px-12 py-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                                            <MapPin className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-white">{l.project_source}</p>
                                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1.5">{l.type}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-10">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-sm font-black text-white">₹{l.price} <span className="text-[10px] text-slate-600 uppercase">/ Ton</span></p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase">{l.volume.toLocaleString()} issuing</span>
                                                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                            <span className="text-[10px] font-black text-slate-500 uppercase">{l.vintage} Vintage</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-10">
                                                    {l.certificate_file ? (
                                                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl w-fit group/file cursor-pointer hover:bg-white/10 transition-all">
                                                            <FileText className="w-4 h-4 text-emerald-400" />
                                                            <span className="text-[10px] font-black text-slate-400 group-hover/file:text-white transition-colors uppercase tracking-widest">{l.certificate_file}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] italic">Awaiting Payload</span>
                                                    )}
                                                </td>
                                                <td className="px-12 py-10 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-11 px-6 text-rose-400 font-black uppercase tracking-widest text-[10px] bg-rose-500/5 hover:bg-rose-500/10 rounded-xl border border-rose-500/10 transition-all"
                                                            onClick={() => handleVerify(l.id, 'Rejected')}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="h-11 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
                                                            onClick={() => handleVerify(l.id, 'Active')}
                                                        >
                                                            Authorize Issuance
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}


            </div>
        </div>
    );
};

export default DeveloperDashboard;
