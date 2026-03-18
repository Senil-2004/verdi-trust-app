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
    FileText,
    ExternalLink,
    Download,
    Globe
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { supabase } from '../lib/supabase';

const SUPABASE_STORAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads`;

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="border-none glass-morphism hover:scale-[1.02] transition-all duration-500 cursor-default group overflow-hidden">
        <CardContent className="p-6 sm:p-8 relative">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 text-teal-500 opacity-[0.03] rounded-full blur-3xl group-hover:opacity-10 transition-opacity" />
            <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1 sm:mb-2">{title}</p>
                <div className="flex items-baseline gap-2 sm:gap-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{value}</h3>
                    {trend === 'up' && <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500/50" />}
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
    const [issuanceHistory, setIssuanceHistory] = useState([]);

    const handleDownloadCSV = (data, fileName) => {
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-IN');
        const dayStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long' });
        const headers = ["ID", "Project Source", "Type", "Price", "Volume", "Vintage", "Status", "Certificate URL"];
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += '"VerdiTrust Institutional Carbon Credit Marketplace"\n';
        csvContent += `"Date","${dateStr}"\n`;
        csvContent += `"Day","${dayStr}"\n\n`;
        csvContent += headers.join(",") + "\n";
        csvContent += data.map(l => {
            const price = String(l.price || '').replace(/,/g, '');
            const volume = String(l.volume || '').replace(/,/g, '');
            const certUrl = l.certificate_file ? `${SUPABASE_STORAGE_URL}/${l.certificate_file}` : 'N/A';
            return `${l.id},"${l.project_source || l.name}","${l.type || 'N/A'}",${price},${volume},${l.vintage || 'N/A'},"${l.status}","${certUrl}"`;
        }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadSingle = (l) => {
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-IN');
        const dayStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long' });

        const content = `================================================
  [VerdiTrust Logo] VERDITRUST
  Institutional Carbon Credit Marketplace

  Date: ${dateStr}
  Day:  ${dayStr}
================================================

Asset Identifier: #ASSET-${l.id}
Source: ${l.project_source}
Type: ${l.type}
Price: ₹${l.price}/Ton
Volume: ${l.volume} Tons
Vintage: ${l.vintage}
Status: ${l.status}
Certificate: ${l.certificate_file || 'N/A'}`;

        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `ASSET-${l.id}-details.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const fetchAllData = async () => {
        try {
            const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
            if (error) throw error;

            if (Array.isArray(data)) {
                // Map database listings to the activity feed
                const mappedProjects = data.map(l => ({
                    id: l.id,
                    name: l.project_source,
                    status: l.status === 'In Review' ? 'Verifying' : l.status === 'Active' ? 'Verified' : l.status,
                    rawDate: l.created_at || new Date().toISOString(),
                    date: l.created_at ? new Date(l.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : "Just now",
                    credits: l.status === 'Active' ? `+${(Number(l.volume) || 0).toLocaleString('en-IN')}` : "Pending",
                    color: l.status === 'Active' ? "text-emerald-400" : l.status === 'In Review' ? "text-amber-400" : "text-rose-400",
                    border: l.status === 'Active' ? "border-emerald-500/20" : l.status === 'In Review' ? "border-amber-500/20" : "border-rose-500/20",
                    bg: l.status === 'Active' ? "bg-emerald-500/10" : l.status === 'In Review' ? "bg-amber-500/10" : "bg-rose-500/10",
                    price: l.price,
                    volume: l.volume,
                    vintage: l.vintage,
                    type: l.type,
                    certificate_file: l.certificate_file
                }));
                setProjects(mappedProjects);

                // Extract listings for the registry
                setReviewListings(data.filter(l => l.status === 'In Review'));
                setIssuanceHistory(data);
            }
        } catch (err) {
            console.error("Dashboard sync error:", err);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            const { error } = await supabase.from('listings').update({ status }).eq('id', id);
            if (error) throw error;

            const listing = projects.find(p => p.id === id);
            if (listing) {
                await supabase.from('notifications').insert([{
                    title: `Listing ${status === 'Active' ? 'Approved' : 'Rejected'}`,
                    message: `Asset from ${listing.name} has been ${status === 'Active' ? 'approved' : 'rejected'}.`
                }]);
            }

            runAction(status === 'Active' ? 'verify' : 'reject', `Listing ${status === 'Active' ? 'Approved' : 'Rejected'}`);
            await fetchAllData();
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
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 sm:space-y-12 animate-in fade-in duration-1000">
            {/* Action Toast */}
            {actionStatus.active && (
                <div className="fixed bottom-6 sm:bottom-12 right-6 sm:right-12 z-50 animate-in slide-in-from-right-10">
                    <div className="glass-morphism-heavy px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                        <span className="text-[10px] sm:text-sm font-black text-white uppercase tracking-widest">{actionStatus.type} successful!</span>
                    </div>
                </div>
            )}



            <div id="portfolio" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Active Protocols" value={projects.filter(p => p.status === 'Verified').length} change="" icon={LayoutDashboard} trend="up" />
                <StatCard
                    title="Issuance Volume"
                    value={projects.filter(p => p.status === 'Verified').reduce((sum, p) => {
                        const numericCredits = parseInt(p.credits.replace(/[+,]/g, '') || 0);
                        return sum + numericCredits;
                    }, 0).toLocaleString()}
                    change=""
                    icon={Leaf}
                    trend="up"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card id="marketplace" className="lg:col-span-2 border-none glass-morphism overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="border-b border-white/5 pb-6 px-6 sm:px-8 pt-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl sm:text-2xl font-black text-white">Project Activity</CardTitle>
                            <CardDescription className="text-slate-500 font-medium text-[10px] sm:text-xs mt-1">Real-time status of environmental asset issuance</CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 px-4 rounded-xl border border-white/10 hover:bg-white/10 text-slate-400 gap-2 w-full sm:w-auto mt-2 sm:mt-0"
                            onClick={() => handleDownloadCSV(projects, 'project-activity')}
                        >
                            <Download className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Export CSV</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="px-6 sm:px-8 py-6 sm:py-8 overflow-x-auto">
                        <div className="space-y-6 min-w-[500px] sm:min-w-0">
                            {projects.length > 0 ? projects.map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-default pb-4 border-b border-white/[0.02] last:border-0">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3.5 rounded-2xl ${item.bg} border ${item.border} group-hover:scale-110 transition-transform duration-500`}>
                                            <ShieldCheck className={`w-5 h-5 ${item.color}`} />
                                        </div>
                                        <div>
                                            <p className="font-black text-white group-hover:text-teal-400 transition-colors uppercase tracking-tight text-sm">{item.name}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <Clock className="w-3 h-3 text-slate-600" />
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="flex flex-col items-end">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${item.border} ${item.bg} ${item.color}`}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                    {item.status}
                                                </div>
                                                {item.status === 'Verified' && (
                                                    <p className="text-[10px] font-black text-slate-500 mt-2">{item.credits} <span className="text-[9px] opacity-50 ml-0.5">tCO2e</span></p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">Initializing system activity...</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-1 space-y-8">
                    <Card className="border-none glass-morphism rounded-[2.5rem] overflow-hidden bg-teal-500/[0.02]">
                        <CardHeader className="px-8 pt-8 pb-4">
                            <CardTitle className="text-lg font-black text-white">Market Insights</CardTitle>
                            <CardDescription className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Global Asset Trends</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-6">
                            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-500/10">
                                <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-3 text-center">Institutional Trust</p>
                                <p className="text-4xl font-black text-white text-center tracking-tighter">99.9%</p>
                                <p className="text-[10px] text-slate-600 font-black text-center mt-2 uppercase tracking-widest">Verification Accuracy</p>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                            <Database className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Nodes</span>
                                    </div>
                                    <span className="text-xs font-black text-white">1,240</span>
                                </div>

                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Review</span>
                                    </div>
                                    <span className="text-xs font-black text-white">4.2 Days</span>
                                </div>

                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regions active</span>
                                    </div>
                                    <span className="text-xs font-black text-white">24 Units</span>
                                </div>
                            </div>

                            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                <FileText className="w-3.5 h-3.5" />
                                View Protocol Docs
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="border-none glass-morphism rounded-[2.5rem] p-8 bg-gradient-to-r from-emerald-600/10 to-teal-600/5 border border-emerald-500/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-500 rounded-2xl">
                                <ShieldCheck className="w-5 h-5 text-black" />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Secure Registry</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            Your environmental assets are processed through institutional-grade encryption protocols and multi-layered validation layers to ensure absolute climate integrity.
                        </p>
                    </Card>
                </div>
            </div>
            {/* Verification Queue Redesign */}
            <Card id="analytics" className="lg:col-span-full border-none glass-morphism overflow-hidden rounded-[2.5rem]">
                <CardHeader className="bg-slate-900/50 border-b border-white/5 p-6 sm:p-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Market Verification Protocol</span>
                            </div>
                            <CardTitle className="text-3xl sm:text-4xl font-black text-white">Issuance Registry</CardTitle>
                            <CardDescription className="text-slate-500 text-base sm:text-lg font-medium mt-2">Comprehensive history and validation of assets</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
                            <div className="text-right glass-morphism px-6 sm:px-8 py-4 sm:py-6 rounded-3xl border border-white/10 flex items-center justify-between sm:justify-center gap-6 sm:gap-8 w-full">
                                <div>
                                    <p className="font-black text-emerald-500 premium-gradient-text uppercase tracking-widest text-[9px] sm:text-[10px] mb-1">Total Filings</p>
                                    <p className="text-2xl sm:text-4xl font-black text-white">{issuanceHistory.length}</p>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div>
                                    <p className="font-black text-amber-500 uppercase tracking-widest text-[9px] sm:text-[10px] mb-1">Pending Review</p>
                                    <p className="text-2xl sm:text-4xl font-black text-white">{reviewListings.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="w-full min-w-[900px]">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                    <th className="px-8 py-6 text-left">Filing Identifier</th>
                                    <th className="px-8 py-6 text-left">Asset Source</th>
                                    <th className="px-8 py-6 text-left">Pricing Models</th>
                                    <th className="px-8 py-6 text-left">Legal Verification</th>
                                    <th className="px-8 py-6 text-right">Issuance Authority</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {issuanceHistory.length > 0 ? issuanceHistory.map((l) => (
                                    <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group cursor-default">
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-mono font-black text-slate-500 bg-white/5 px-2 py-1 rounded-md">#ASSET-{l.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="relative w-16 h-12 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex-shrink-0">
                                                    {l.cover_image ? (
                                                        <img
                                                            src={l.cover_image?.startsWith('http') ? l.cover_image : `${SUPABASE_STORAGE_URL}/${l.cover_image}`}
                                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80'; }}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <MapPin className="w-4 h-4 text-slate-700" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">{l.project_source}</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1.5">{l.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm font-black text-white">₹{(Number(l.price) || 0).toLocaleString('en-IN')} <span className="text-[10px] text-slate-600 uppercase">/ Ton</span></p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase">{(Number(l.volume) || 0).toLocaleString('en-IN')} issuing</span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase">{l.vintage} Vintage</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {l.certificate_file ? (
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`/uploads/${l.certificate_file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl w-fit group/file transition-all cursor-pointer"
                                                    >
                                                        <FileText className="w-4 h-4 text-emerald-400" />
                                                        <span className="text-[10px] font-black text-slate-400 group-hover/file:text-emerald-400 transition-colors uppercase tracking-widest">{l.certificate_file}</span>
                                                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover/file:text-emerald-400 opacity-0 group-hover/file:opacity-100 transition-all" />
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-10 w-10 p-0 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-500 transition-all flex items-center justify-center flex-shrink-0"
                                                        title="Download Project Details"
                                                        onClick={() => handleDownloadSingle(l)}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] italic">Awaiting Payload</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {l.status === 'In Review' ? (
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
                                                        Authorize
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end items-center gap-3">
                                                    <div className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${l.status === 'Active' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${l.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                        {l.status === 'Active' ? 'Authorized' : l.status}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-white/5 rounded-2xl text-slate-700">
                                                    <Clock className="w-8 h-8" />
                                                </div>
                                                <p className="text-sm font-black text-slate-600 uppercase tracking-[0.2em]">No registry entries found. Registry initialized.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>


        </div >
    );
};

export default DeveloperDashboard;
