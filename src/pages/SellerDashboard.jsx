import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    LayoutDashboard,
    Leaf,
    TrendingUp,
    IndianRupee,
    BarChart3,
    Plus,
    CheckCircle2,
    Clock,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Users,
    Globe,
    ExternalLink,
    AlertCircle,
    X,
    Calculator,
    Zap,
    FileUp,
    Edit2,
    Trash2,
    Image as ImageIcon
} from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const StatCard = ({ title, value, change, icon: Icon, trend, color }) => (
    <Card className="border-none glass-morphism hover:scale-[1.02] transition-all duration-500 cursor-default group overflow-hidden">
        <CardContent className="p-8 relative">
            <div className={`absolute -right-4 -top-4 w-32 h-32 ${color.replace('bg-', 'text-')} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${color} bg-opacity-10 border border-current text-current group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">{title}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
            </div>
        </CardContent>
    </Card>
);

const SellerDashboard = () => {
    const [actionStatus, setActionStatus] = useState({ type: '', active: false });

    const [isListingOpen, setIsListingOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEliteOpen, setIsEliteOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingListing, setDeletingListing] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingListing, setEditingListing] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [newListing, setNewListing] = useState({
        project_source: 'Amazon Reforestation',
        volume: '',
        price: '',
        type: 'Nature',
        vintage: 2024
    });

    const [errors, setErrors] = useState({});

    const [listings, setListings] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);








    const runAction = (label) => {
        setActionStatus({ type: label, active: true });
        setTimeout(() => setActionStatus({ type: '', active: false }), 3000);
    };

    const validateListing = () => {
        const newErrors = {};
        if (!newListing.project_source) newErrors.project_source = "Project source is required";
        if (!newListing.volume || isNaN(newListing.volume) || Number(newListing.volume) <= 0) newErrors.volume = "Valid volume is required";
        if (!newListing.price || isNaN(newListing.price) || Number(newListing.price) <= 0) newErrors.price = "Valid price is required";
        if (!newListing.vintage || isNaN(newListing.vintage) || newListing.vintage < 2000 || newListing.vintage > 2100) newErrors.vintage = "Valid vintage year is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const [chartView, setChartView] = useState('revenue');

    const chartData = useMemo(() => {
        const monthlyData = new Array(12).fill(0);

        recentTransactions.forEach(tx => {
            const dateStr = tx.transaction_date || tx.created_at || tx.date;
            if (!dateStr) return;

            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return;

            const month = date.getMonth();
            const val = chartView === 'revenue' ? Number(tx.amount) : Number(tx.credits);
            if (!isNaN(val)) {
                monthlyData[month] += val;
            }
        });

        const maxVal = Math.max(...monthlyData, 1);
        return monthlyData.map(val => ({
            value: val,
            percentage: (val / maxVal) * 100
        }));
    }, [recentTransactions, chartView]);

    const fetchData = async () => {
        try {
            const listingsRes = await fetch('/api/listings');
            const listingsData = await listingsRes.json();
            setListings(listingsData);

            const txRes = await fetch('/api/transactions');
            const txData = await txRes.json();
            setRecentTransactions(txData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Dynamic stats derived from active listings only
    const activeListings = listings.filter(l => l.status === 'Active');
    const totalCreditsAvailable = activeListings.reduce((sum, l) => sum + Number(l.volume), 0);


    const totalSales = recentTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const soldToDate = recentTransactions.reduce((sum, t) => sum + Number(t.credits), 0);

    const handleEditListing = (listing) => {
        setEditingListing(listing);
        setIsEditOpen(true);
    };

    const handleUpdateListing = async () => {
        try {
            const res = await fetch(`/api/listings/${editingListing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingListing)
            });
            if (res.ok) {
                runAction('Listing updated');
                setIsEditOpen(false);
                fetchData();
            }
        } catch (error) {
            console.error("Failed to update listing", error);
        }
    };

    const handleDeleteListing = async () => {
        try {
            const res = await fetch(`/api/listings/${deletingListing.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                runAction('Listing deleted');
                setIsDeleteOpen(false);
                setDeletingListing(null);
                fetchData();
            }
        } catch (error) {
            console.error("Failed to delete listing", error);
        }
    };

    return (
        <div className="p-12 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000">
            {/* Action Toast */}
            {actionStatus.active && (
                <div className="fixed bottom-12 right-12 z-50 animate-in slide-in-from-right-10">
                    <div className="glass-morphism-heavy px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-black text-white uppercase tracking-widest">{actionStatus.type} initiated!</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-emerald-500/10 rounded-full blur-[60px] -z-10" />

                <div className="flex gap-4">

                    <Dialog open={isListingOpen} onOpenChange={setIsListingOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="h-14 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-[0.98] group"
                            >
                                <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                                Create Offering
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-[#080c0a] border border-white/10 text-white rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 p-10 border-b border-white/10">
                                <DialogTitle className="text-4xl font-black tracking-tight mb-2">Create New Offering</DialogTitle>
                                <p className="text-slate-400 font-medium">Deploy your verified carbon assets to the global marketplace.</p>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Asset Parameters</Label>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-400">Project Source</Label>
                                            <select
                                                className={`w-full h-14 px-5 rounded-2xl border ${errors.project_source ? 'border-rose-500' : 'border-white/10'} bg-white/5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none`}
                                                value={newListing.project_source}
                                                onChange={(e) => setNewListing({ ...newListing, project_source: e.target.value })}
                                            >
                                                <option className="bg-slate-900">Amazon Reforestation</option>
                                                <option className="bg-slate-900">Wind Farm Indonesia</option>
                                                <option className="bg-slate-900">Solar Park Rajasthan</option>
                                            </select>
                                            {errors.project_source && <p className="text-xs text-rose-500 font-medium ml-1 mt-1">{errors.project_source}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400">Volume (Tons)</Label>
                                                <Input
                                                    placeholder="5000"
                                                    className={`h-14 bg-white/5 border ${errors.volume ? 'border-rose-500' : 'border-white/10'} rounded-2xl px-5 text-white font-bold placeholder:text-slate-600`}
                                                    value={newListing.volume}
                                                    onChange={(e) => setNewListing({ ...newListing, volume: e.target.value })}
                                                />
                                                {errors.volume && <p className="text-xs text-rose-500 font-medium ml-1 mt-1">{errors.volume}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400">Price / Ton</Label>
                                                <Input
                                                    placeholder="₹20.00"
                                                    className={`h-14 bg-white/5 border ${errors.price ? 'border-rose-500' : 'border-white/10'} rounded-2xl px-5 text-white font-bold placeholder:text-slate-600`}
                                                    value={newListing.price}
                                                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                                                />
                                                {errors.price && <p className="text-xs text-rose-500 font-medium ml-1 mt-1">{errors.price}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500">Legal Verification</Label>
                                        </div>
                                        <div className="relative group/upload">
                                            <input
                                                type="file"
                                                id="cert-upload"
                                                className="hidden"
                                                onChange={(e) => setUploadedFile(e.target.files[0])}
                                                accept=".pdf,.jpg,.png"
                                            />
                                            <label
                                                htmlFor="cert-upload"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all cursor-pointer group"
                                            >
                                                {uploadedFile ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-xs font-bold text-white">{uploadedFile.name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-black">Click to replace</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="p-2 bg-white/5 rounded-lg text-slate-500 group-hover:text-emerald-400 transition-colors">
                                                            <FileUp className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verification Docs</p>
                                                        <p className="text-[10px] text-slate-600 font-medium italic">PDF, Max 10MB</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Visual Identity</Label>
                                    </div>
                                    <div className="relative group/upload">
                                        <input
                                            type="file"
                                            id="cover-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setCoverImage(file);
                                                    setCoverImagePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                        <label
                                            htmlFor="cover-upload"
                                            className="flex flex-col items-center justify-center w-full h-[320px] border-2 border-dashed border-white/10 rounded-[2rem] bg-white/5 hover:bg-blue-500/5 hover:border-blue-500/30 transition-all cursor-pointer group overflow-hidden relative"
                                        >
                                            {coverImagePreview ? (
                                                <div className="relative w-full h-full">
                                                    <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                        <ImageIcon className="w-8 h-8 mb-2" />
                                                        <p className="text-xs font-black uppercase tracking-widest">Change Cover Image</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 p-8 text-center">
                                                    <div className="p-4 bg-white/5 rounded-3xl text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all">
                                                        <ImageIcon className="w-10 h-10" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-2">Cover Page Image</p>
                                                        <p className="text-xs text-slate-500 font-medium">Recommended: 16:9 Aspect Ratio<br />Supports JPG, PNG, WebP</p>
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-white/5 flex justify-end gap-4 rounded-b-[2.5rem]">
                                <Button
                                    variant="ghost"
                                    className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5"
                                    onClick={() => setIsListingOpen(false)}
                                >
                                    Abort
                                </Button>
                                <Button
                                    className="h-14 px-12 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/40 hover:bg-emerald-500 transition-all"
                                    onClick={async () => {
                                        if (!validateListing()) return;

                                        const res = await fetch('/api/listings', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                ...newListing,
                                                certificate_file: uploadedFile ? uploadedFile.name : null,
                                                cover_image: coverImage ? coverImage.name : null
                                            })
                                        });
                                        if (res.ok) {
                                            setIsListingOpen(false);
                                            setUploadedFile(null);
                                            setErrors({});
                                            runAction('Listing creation');
                                            fetchData();
                                        }
                                    }}
                                >
                                    Publish Offering
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Listing Dialog */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="max-w-4xl glass-morphism-heavy border-white/10 text-white rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-12 border-b border-white/10">
                                <DialogTitle className="text-4xl font-black tracking-tight mb-2">Modify Asset Configuration</DialogTitle>
                                <p className="text-slate-400 font-medium font-lg">Adjust performance and market parameters for CRT-{editingListing?.id}</p>
                            </div>

                            <div className="p-12 grid grid-cols-1 md:grid-cols-12 gap-12">
                                <div className="md:col-span-7 space-y-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                                                <Edit2 className="w-5 h-5" />
                                            </div>
                                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Core Metadata</Label>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-400 ml-1">Project Identifier/Source</Label>
                                            <Input
                                                placeholder="e.g., Amazon Reforestation"
                                                className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-xl font-black text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                value={editingListing?.project_source || ''}
                                                onChange={(e) => setEditingListing({ ...editingListing, project_source: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400 ml-1">Asset volume (Tons)</Label>
                                                <Input
                                                    placeholder="5000"
                                                    className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-black text-white"
                                                    value={editingListing?.volume || ''}
                                                    onChange={(e) => setEditingListing({ ...editingListing, volume: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400 ml-1">Market Price / Ton</Label>
                                                <Input
                                                    placeholder="₹20.00"
                                                    className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-black text-emerald-400"
                                                    value={editingListing?.price || ''}
                                                    onChange={(e) => setEditingListing({ ...editingListing, price: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400 ml-1">Classification Type</Label>
                                                <select
                                                    className="w-full h-16 px-6 rounded-2xl border border-white/10 bg-white/5 text-sm font-black text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                                                    value={editingListing?.type || 'Nature'}
                                                    onChange={(e) => setEditingListing({ ...editingListing, type: e.target.value })}
                                                >
                                                    <option className="bg-slate-900">Nature</option>
                                                    <option className="bg-slate-900">Energy</option>
                                                    <option className="bg-slate-900">Technology</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400 ml-1">Vintage Cycle</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="2024"
                                                    className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-black text-white"
                                                    value={editingListing?.vintage || 2024}
                                                    onChange={(e) => setEditingListing({ ...editingListing, vintage: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-5 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Hero Visualization</Label>
                                    </div>

                                    <div className="relative group/upload h-full max-h-[400px]">
                                        <input
                                            type="file"
                                            id="edit-cover-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setEditingListing({ ...editingListing, cover_image_file: file, cover_image: file.name });
                                                    setCoverImagePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                        <label
                                            htmlFor="edit-cover-upload"
                                            className="flex flex-col items-center justify-center w-full h-full min-h-[300px] border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 hover:bg-blue-500/5 hover:border-blue-400/30 transition-all cursor-pointer group overflow-hidden relative shadow-inner"
                                        >
                                            {coverImagePreview || editingListing?.cover_image ? (
                                                <div className="relative w-full h-full">
                                                    <img src={coverImagePreview || editingListing?.cover_image} alt="Cover Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                        <ImageIcon className="w-8 h-8 mb-2" />
                                                        <p className="text-xs font-black uppercase tracking-widest text-center">Swap Presentation<br />Asset</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-center p-8">
                                                    <ImageIcon className="w-12 h-12 text-slate-700 group-hover:text-blue-400 transition-colors" />
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Null Presentation</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 bg-white/5 border-t border-white/10 flex justify-end gap-6 rounded-b-[3rem]">
                                <Button
                                    variant="ghost"
                                    className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all"
                                    onClick={() => setIsEditOpen(false)}
                                >
                                    Cancel Changes
                                </Button>
                                <Button
                                    className="h-16 px-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-900/40 transition-all active:scale-[0.98]"
                                    onClick={handleUpdateListing}
                                >
                                    Commit Updates
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* View Public Profile Dialog */}
                    <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                        <DialogContent className="max-w-lg bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-slate-900">Public Profile Preview</DialogTitle>
                                <CardDescription className="text-slate-500">This is how buyers see your seller profile</CardDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-2xl border-2 border-emerald-200">
                                        {localStorage.getItem('userName')?.[0]?.toUpperCase() || 'S'}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-slate-900">{localStorage.getItem('userName') || 'Seller'}</h3>
                                        <p className="text-xs text-slate-500 font-medium">Verified Carbon Seller</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Verified</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Total Listings</p>
                                        <p className="text-2xl font-black text-blue-900 mt-1">{listings.length}</p>
                                    </div>
                                    <div className="p-3 bg-emerald-50 rounded-lg">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Active Credits</p>
                                        <p className="text-2xl font-black text-emerald-900 mt-1">{totalCreditsAvailable.toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 italic text-center">This profile is visible to all marketplace buyers</p>
                            </div>
                            <DialogFooter>
                                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setIsProfileOpen(false)}>Close Preview</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Activate Elite Dialog */}
                    <Dialog open={isEliteOpen} onOpenChange={setIsEliteOpen}>
                        <DialogContent className="max-w-lg bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black flex items-center gap-2 text-slate-900">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                    Elite Seller Program
                                </DialogTitle>
                                <CardDescription className="text-slate-500">Unlock premium features and institutional access</CardDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                    <h4 className="font-black text-sm text-emerald-900 mb-3">Premium Benefits</h4>
                                    <ul className="space-y-2">
                                        {[
                                            'Priority listing placement',
                                            'Access to institutional buyers',
                                            'Advanced analytics dashboard',
                                            'Dedicated account manager',
                                            'Reduced platform fees (1.5%)'
                                        ].map((benefit, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                <span className="font-medium">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl text-white">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Monthly Fee</p>
                                            <p className="text-3xl font-black mt-1">₹4,999<span className="text-sm text-slate-400">/mo</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Save 20%</p>
                                            <p className="text-xs font-black text-emerald-400">Annual Plan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="flex gap-2">
                                <Button variant="ghost" onClick={() => setIsEliteOpen(false)}>Maybe Later</Button>
                                <Button className="bg-emerald-600 text-white" onClick={() => {
                                    runAction('Elite activation');
                                    setIsEliteOpen(false);
                                }}>
                                    Activate Now
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogContent className="max-w-md bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black flex items-center gap-2 text-rose-600">
                                    <AlertCircle className="w-6 h-6" />
                                    Delete Listing?
                                </DialogTitle>
                                <CardDescription>This action cannot be undone</CardDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                                    <p className="text-sm text-slate-700 font-medium">
                                        You are about to permanently delete:
                                    </p>
                                    <p className="text-base font-black text-slate-900 mt-2">
                                        {deletingListing?.project_source}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                                        <span className="font-bold">{deletingListing?.volume} tons</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="font-bold">₹{deletingListing?.price}/ton</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-4 text-center italic">
                                    All associated data will be removed from the marketplace
                                </p>
                            </div>
                            <DialogFooter className="flex gap-2">
                                <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-rose-600 text-white hover:bg-rose-700"
                                    onClick={handleDeleteListing}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Permanently
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div id="portfolio" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Sales" value={`₹${totalSales.toLocaleString()}`} change="18.2%" icon={IndianRupee} trend="up" color="bg-emerald-500" />
                <StatCard title="Credits Available" value={totalCreditsAvailable.toLocaleString()} change="4.1%" icon={Leaf} trend="up" color="bg-teal-500" />
                <StatCard title="Sold to Date" value={soldToDate.toLocaleString()} change="2.3%" icon={CheckCircle2} trend="down" color="bg-blue-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card id="marketplace" className="lg:col-span-2 border-none glass-morphism overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="border-b border-white/5 pb-8 px-10 pt-10 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-white">Market Listings</CardTitle>
                            <CardDescription className="text-slate-500 font-medium">Your active carbon credit offers on the exchange</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white w-56 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600" placeholder="Search orders..." />
                            </div>
                            <Button variant="ghost" size="sm" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400">
                                <Filter className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Pending Submissions Alert */}
                        {listings.some(l => l.status === 'In Review') && (
                            <div className="mx-10 mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-center justify-between group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
                                        <Clock className="w-6 h-6 animate-spin-slow" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-amber-400 uppercase tracking-widest">
                                            {listings.filter(l => l.status === 'In Review').length} Verification(s) Pending
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Institutional verification in progress by the Developer network.</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 glass-morphism px-4 py-2 rounded-full border border-amber-500/20 shadow-lg shadow-amber-500/10">In Protocol</span>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto mt-8">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-white/5">
                                        <th className="px-10 py-6">Identifier</th>
                                        <th className="px-10 py-6">Asset Source</th>
                                        <th className="px-10 py-6">Price Point</th>
                                        <th className="px-10 py-6">Market Health</th>
                                        <th className="px-10 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {listings.filter(item => item.status !== 'In Review').map((item, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-default">
                                            <td className="px-10 py-8">
                                                <span className="text-xs font-mono font-black text-slate-500 bg-white/5 px-2 py-1 rounded-md">CRT-{item.id}</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                                        <Leaf className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white">{item.project_source}</p>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{item.type}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-white">₹{Number(item.price).toFixed(2)}</p>
                                                <p className="text-[10px] text-emerald-500 font-bold mt-1.5">Market Spot</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-2.5 w-36">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                        <span className={item.status === 'Sold Out' ? 'text-rose-400' : 'text-emerald-400'}>
                                                            {item.status === 'Active' ? 'Verified' : item.status}
                                                        </span>
                                                        <span className="text-slate-500">{item.fill_percentage}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-[1500ms] ${item.status === 'Sold Out' ? 'bg-rose-500' : 'bg-emerald-500'
                                                                } shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                                                            style={{ width: `${item.fill_percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="relative">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
                                                        onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                                    >
                                                        <MoreVertical className="w-5 h-5 text-slate-500" />
                                                    </Button>
                                                    {openMenuId === item.id && (
                                                        <div className="absolute right-0 mt-3 w-48 glass-morphism-heavy rounded-[1.25rem] shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-3xl">
                                                            <button
                                                                onClick={() => {
                                                                    handleEditListing(item);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full px-5 py-3 text-left text-xs font-black text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
                                                            >
                                                                <Edit2 className="w-4 h-4 text-emerald-400" />
                                                                Modify Asset
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setDeletingListing(item);
                                                                    setIsDeleteOpen(true);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full px-5 py-3 text-left text-xs font-black text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Liquidate Listing
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-none glass-morphism rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="pb-6 px-8 pt-8">
                            <CardTitle className="text-xl font-black text-white">Seller Intelligence</CardTitle>
                            <CardDescription className="text-slate-500 font-medium">Performance metrics this cycle</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 px-8 pb-8">
                            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                                        <BarChart3 className="w-5 h-5" />
                                    </div>
                                    <p className="font-black text-emerald-500 text-[10px] uppercase tracking-widest">Active Quotations</p>
                                </div>
                                <div className="flex items-end gap-3 relative z-10">
                                    <p className="text-4xl font-black text-white tracking-tight">42</p>
                                    <p className="text-[10px] font-black text-emerald-400 mb-2 uppercase tracking-widest">+15% Delta</p>
                                </div>
                            </div>

                            <Card className="border-white/5 bg-white/5 shadow-none rounded-3xl border">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Institutional Credibility</p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />)}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Verification Velocity</span>
                                            <span className="text-emerald-400">98%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full w-[98%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full h-12 text-[10px] font-black uppercase tracking-widest border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                                        onClick={() => setIsProfileOpen(true)}
                                    >
                                        Inspect Public Profile
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="p-6 bg-gradient-to-br from-slate-900 to-black rounded-3xl relative overflow-hidden group border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Elite Program Active</p>
                                    </div>
                                    <p className="text-sm font-bold text-white leading-relaxed">Early access to institutional carbon liquidity pools and wholesale bidding.</p>
                                    <Button
                                        className="w-full bg-white text-slate-900 h-12 text-[10px] font-black uppercase tracking-widest border-none hover:bg-emerald-50 rounded-2xl transition-all"
                                        onClick={() => setIsEliteOpen(true)}
                                    >
                                        Configure Elite Access
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card id="analytics" className="lg:col-span-3 border-none glass-morphism rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="border-b border-white/5 pb-8 px-10 pt-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-black text-white">Capital Inflow</CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Monthly transaction settlement volume (tCO2e)</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                                <button
                                    onClick={() => setChartView('revenue')}
                                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${chartView === 'revenue' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'text-slate-500 border-transparent hover:text-white'}`}
                                >
                                    Revenue
                                </button>
                                <button
                                    onClick={() => setChartView('volume')}
                                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${chartView === 'volume' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'text-slate-500 border-transparent hover:text-white'}`}
                                >
                                    Volume
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-16 pb-12 px-10">
                        <div className="h-72 flex items-end justify-between gap-6 relative">
                            {/* Grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full border-t border-slate-500 h-px" />
                                ))}
                            </div>
                            {chartData.map((d, i) => (
                                <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20">
                                        <span className="glass-morphism-heavy text-white text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/20 shadow-2xl">
                                            {chartView === 'revenue' ? `₹${d.value.toLocaleString()}` : `${d.value} tCO2e`}
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all duration-500 overflow-hidden border border-white/[0.03] group-hover:border-emerald-500/30"
                                        style={{ height: `${d.percentage || 2}%` }}
                                    >
                                        <div
                                            className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-2xl opacity-40 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                            style={{ height: '100%' }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 group-hover:text-emerald-400 mt-6 text-center tracking-tighter transition-colors">
                                        {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none glass-morphism rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="pb-6 px-8 pt-8 border-b border-white/5">
                        <CardTitle className="text-xl font-black text-white">Settlements</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Verified customer procurement</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {recentTransactions.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest">No Settlements</p>
                                    <p className="text-xs text-slate-600 font-medium mt-1">Transactions will appear here once processed.</p>
                                </div>
                            ) : (
                                recentTransactions.map((tx, i) => (
                                    <div key={i} className="p-6 hover:bg-white/[0.03] transition-colors cursor-pointer group" onClick={() => runAction(`View settlement ${tx.id}`)}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">{tx.buyer}</p>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{tx.date}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs font-black text-slate-400">{tx.credits} tCO2e</p>
                                                <p className="text-lg font-black premium-gradient-text mt-0.5">{tx.amount}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }`}>
                                                {tx.status}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Button variant="ghost" className="w-full rounded-none h-16 text-[10px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 hover:bg-white/5 hover:text-white transition-all" onClick={() => runAction('Open secure ledger')}>
                            Access Institutional Ledger
                        </Button>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
};

export default SellerDashboard;
