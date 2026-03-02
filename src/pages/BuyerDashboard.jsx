import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShoppingCart, Award, Globe, LineChart, Search, Filter, ArrowUpRight, CheckCircle2, TrendingUp, Download, Leaf, ShieldCheck, Calendar, Zap, Info, CreditCard, Lock, Wallet, FileText } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const PortfolioStat = ({ label, value, icon: Icon, color, trend }) => (
    <Card className="border-none glass-morphism hover:scale-[1.02] transition-all duration-500 cursor-default group overflow-hidden opacity-0 animate-reveal-up">
        <CardContent className="p-10 relative">
            <div className={`absolute -right-4 -top-4 w-40 h-40 ${color} opacity-[0.03] rounded-full blur-[80px] group-hover:opacity-10 transition-opacity`} />
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${color} bg-opacity-10 border border-current transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                        <ArrowUpRight className="w-3 h-3" />
                        {trend}%
                    </div>
                </div>
            </div>
            <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-3">{label}</p>
                <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
                    <TrendingUp className="w-5 h-5 text-emerald-500/50" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const BuyerDashboard = () => {
    const navigate = useNavigate();
    const [actionStatus, setActionStatus] = useState({ type: '', active: false });
    const [projects, setProjects] = useState([]);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [stats, setStats] = useState({ totalCredits: 0, totalSpent: 0, activeProjects: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [purchaseQty, setPurchaseQty] = useState('');
    const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

    const [monthlyData, setMonthlyData] = useState([]);

    // ... (other states)

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsRes, listingsRes, projectsRes, transactionsRes] = await Promise.all([
                fetch('/api/buyer/stats'),
                fetch('/api/listings'),
                fetch('/api/projects'),
                fetch('/api/transactions')
            ]);

            if (!statsRes.ok || !listingsRes.ok || !projectsRes.ok || !transactionsRes.ok) throw new Error('Systems Connectivity Issue');

            const statsData = await statsRes.json();
            const listingsData = await listingsRes.json();
            const projectsData = await projectsRes.json();
            const transactionsData = await transactionsRes.json();

            setStats({
                totalCredits: Number(statsData.totalCredits) || 0,
                totalSpent: Number(statsData.totalSpent) || 0,
                activeProjects: Number(statsData.activeProjects) || 0
            });

            // Process Monthly Data
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const currentYear = new Date().getFullYear();
            const monthlyVolumes = new Array(12).fill(0);

            transactionsData.forEach(t => {
                const date = new Date(t.transaction_date);
                if (date.getFullYear() === currentYear) {
                    monthlyVolumes[date.getMonth()] += Number(t.credits);
                }
            });

            const maxVolume = Math.max(...monthlyVolumes, 100); // 100 as fallback max
            const processedMonthlyData = months.map((month, i) => ({
                month,
                volume: monthlyVolumes[i],
                percentage: (monthlyVolumes[i] / maxVolume) * 100
            }));

            setMonthlyData(processedMonthlyData);

            setProjects(listingsData.filter(item => item.status !== 'In Review').map(item => ({
                id: item.id,
                title: item.project_source,
                origin: item.project_source.includes('Amazon') ? 'Brazil' : item.project_source.includes('Indonesia') ? 'Indonesia' : 'India',
                price: `₹${Number(item.price).toLocaleString('en-IN')}/ton`,
                rating: "AAA",
                img: item.cover_image
                    ? (item.cover_image.startsWith('http') ? item.cover_image : `http://localhost:3005/uploads/${item.cover_image}`)
                    : (item.project_source.includes('Amazon') ? 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80' :
                        item.project_source.includes('Wind') ? 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1200&q=80' :
                            'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80'),
                icon: item.type === 'Energy' ? Zap : Leaf,
                description: `Certified ${item.type} carbon sequestration project. This institutional-grade asset represents verifiable climate impact with Tier-1 integrity.`,
                vintage: item.vintage,
                standard: "Verra (VCS)",
                volume: `${Number(item.volume).toLocaleString('en-IN')} tCO2e`,
                developer: "VerdiTrust Verified",
                status: item.status,
                certificate_file: item.certificate_file
            })));

            setPendingProjects(projectsData.map(p => ({ ...p, date: new Date(p.submitted_at).toLocaleDateString('en-IN') })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenPayment = () => { if (selectedProject && purchaseQty) { setIsPurchaseOpen(false); setIsPaymentOpen(true); } };

    const handlePurchase = async () => {
        const pricePerTon = parseFloat(selectedProject.price.replace('₹', '').replace('/ton', ''));
        const totalAmount = pricePerTon * parseInt(purchaseQty);

        const options = {
            key: "rzp_test_placeholder", // Replace with your actual Razorpay Key ID
            amount: totalAmount * 100, // Amount in paise
            currency: "INR",
            name: "VerdiTrust Marketplace",
            description: `Institutional Settlement for ${selectedProject.title}`,
            image: "/vite.svg",
            handler: async function (response) {
                // Success Callback
                setIsPaymentProcessing(true);
                try {
                    const res = await fetch('/api/transactions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            buyer_name: localStorage.getItem('userName') || "Current User",
                            credits: parseInt(purchaseQty),
                            amount: totalAmount,
                            status: "Completed",
                            razorpay_payment_id: response.razorpay_payment_id
                        })
                    });
                    if (res.ok) {
                        setPaymentSuccess(true);
                        setIsPaymentProcessing(false);
                        setTimeout(() => {
                            setIsPaymentOpen(false);
                            setPaymentSuccess(false);
                            runAction(`Settlement Finalized: ${response.razorpay_payment_id}`);
                            setPurchaseQty('');
                            fetchData();
                        }, 2000);
                    }
                } catch (err) {
                    setIsPaymentProcessing(false);
                }
            },
            prefill: {
                name: localStorage.getItem('userName') || "Buyer",
                email: "buyer@verditrust.com",
            },
            theme: {
                color: "#10b981",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            runAction("Payment Failed: " + response.error.description);
        });
        rzp.open();
    };

    const handleDownloadCSV = (data, fileName) => {
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-IN');
        const dayStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long' });
        const headers = ["Project Name", "Origin", "Price", "Vintage", "Standard", "Volume", "Status", "Certificate URL"];
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += '"VerdiTrust Institutional Carbon Credit Marketplace"\n';
        csvContent += `"Date","${dateStr}"\n`;
        csvContent += `"Day","${dayStr}"\n\n`;
        csvContent += headers.join(",") + "\n";
        csvContent += data.map(p => {
            const certUrl = p.certificate_file ? `http://localhost:3005/uploads/${p.certificate_file}` : 'N/A';
            return `"${p.title || p.name}","${p.origin || 'N/A'}",${String(p.price || '').replace(/[₹,]/g, '')},${p.vintage || 'N/A'},"${p.standard || 'N/A'}","${p.volume || 'N/A'}","${p.status}","${certUrl}"`;
        }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const runAction = (label) => {
        setActionStatus({ type: label, active: true });
        setTimeout(() => setActionStatus({ type: '', active: false }), 3000);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
            {/* Action Toast */}
            {actionStatus.active && (
                <div className="fixed bottom-12 right-12 z-50 animate-in slide-in-from-right-10">
                    <div className="glass-morphism-heavy px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-black text-white uppercase tracking-widest">{actionStatus.type}</span>
                    </div>
                </div>
            )}

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="glass-morphism-heavy border-white/10 text-white rounded-[3rem] p-0 shadow-2xl max-w-4xl overflow-hidden max-h-[95vh]">
                    <div className="h-64 relative">
                        <img src={selectedProject?.img} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080c0a] via-[#080c0a]/40 to-transparent" />
                        <div className="absolute bottom-6 left-12">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{selectedProject?.rating} Rating</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{selectedProject?.origin} Origin</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight">{selectedProject?.title}</h2>
                        </div>
                    </div>
                    <div className="px-12 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-7 space-y-6">
                            <div>
                                <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Asset Intelligence</h4>
                                <p className="text-slate-300 text-base leading-relaxed font-medium line-clamp-3">{selectedProject?.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2"><Calendar className="w-3 h-3" /> Vintage</p>
                                    <p className="text-xs font-black text-slate-300">{selectedProject?.vintage}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Standard</p>
                                    <p className="text-xs font-black text-slate-300">{selectedProject?.standard}</p>
                                </div>
                            </div>
                            {selectedProject?.certificate_file && (
                                <div className="pt-6 border-t border-white/5">
                                    <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3">Verification Artifacts</h4>
                                    <a
                                        href={`http://localhost:3005/uploads/${selectedProject.certificate_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center gap-4 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all w-full group"
                                    >
                                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">Protocol Certificate</p>
                                            <p className="text-[9px] text-slate-500 font-bold mt-0.5 truncate">{selectedProject.certificate_file}</p>
                                        </div>
                                        <Download className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-5 glass-morphism rounded-3xl p-6 border-white/5 flex flex-col justify-between bg-white/[0.02]">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">Available Liquidity</p>
                                    <p className="text-2xl font-black text-white">{Number(selectedProject?.volume?.replace(/[^0-9]/g, '') || 0).toLocaleString('en-IN')} tCO2e</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">Institutional Price</p>
                                    <p className="text-4xl font-black text-emerald-400 tracking-tighter flex items-baseline gap-1">
                                        {selectedProject?.price?.split('/')[0]}
                                        <span className="text-xs font-black text-slate-600 whitespace-nowrap">/ tCO2e</span>
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => { setIsDetailsOpen(false); setIsPurchaseOpen(true); }}
                                className="h-14 w-full bg-white text-[#080c0a] font-black text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-emerald-500 transition-all mt-6 shadow-xl shadow-emerald-500/10"
                            >
                                Initialize Purchase
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isPurchaseOpen} onOpenChange={setIsPurchaseOpen}>
                <DialogContent className="glass-morphism-heavy border-white/10 text-white rounded-[2.5rem] p-8 shadow-2xl max-w-lg w-full overflow-y-auto max-h-[90vh] scrollbar-hide">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight">Purchase Credits</DialogTitle>
                        <CardDescription className="text-slate-400 font-medium text-base mt-2">
                            Deploying capital into {selectedProject?.title}
                        </CardDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Inventory Quantity (Tons)</Label>
                            <Input
                                type="number"
                                placeholder="00"
                                className="h-16 bg-white/5 border-white/10 rounded-2xl text-2xl font-black px-6 focus:ring-emerald-500/20"
                                value={purchaseQty}
                                onChange={(e) => setPurchaseQty(e.target.value)}
                            />
                        </div>
                        {selectedProject && purchaseQty && (
                            <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex justify-between items-center">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Estimated Value</span>
                                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                                    ₹{(parseFloat(selectedProject.price.replace(/[₹,]/g, '').replace('/ton', '')) * parseInt(purchaseQty || '0')).toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="gap-4">
                        <Button variant="ghost" onClick={() => setIsPurchaseOpen(false)} className="h-14 rounded-2xl font-bold px-8">Cancel</Button>
                        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black h-14 px-10 rounded-2xl shadow-xl shadow-emerald-900/20" onClick={handleOpenPayment}>Open Checkout</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Modal remains premium as designed previously */}
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none">
                    <div className="bg-[#0c1210] p-10 text-white">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 p-2.5 rounded-2xl">
                                    <ShieldCheck className="w-5 h-5 text-[#080c0a]" />
                                </div>
                                <span className="font-black text-xl tracking-tight">VerdiPay</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Vault</span>
                        </div>

                        {!isPaymentProcessing && !paymentSuccess ? (
                            <div className="space-y-8">
                                <div>
                                    <p className="text-5xl font-black tracking-tight text-white">
                                        ₹{(parseFloat(selectedProject?.price.replace('₹', '').replace('/ton', '') || '0') * parseInt(purchaseQty || '0')).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-[0.2em]">Transaction Total</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Payment Instrument</Label>
                                        <div className="relative">
                                            <CreditCard className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                                            <Input className="bg-white/5 border-white/10 h-16 pl-14 rounded-2xl text-white placeholder:text-slate-700 font-bold" placeholder="0000 0000 0000 0000" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <Input className="bg-white/5 border-white/10 h-16 rounded-2xl text-white placeholder:text-slate-700 text-center font-bold" placeholder="MM/YY" />
                                        <Input className="bg-white/5 border-white/10 h-16 rounded-2xl text-white placeholder:text-slate-700 text-center font-bold" placeholder="•••" type="password" />
                                    </div>
                                </div>

                                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#080c0a] font-black h-16 rounded-2xl transition-all shadow-2xl shadow-emerald-500/20 text-lg" onClick={handlePurchase}>Authorize Payment</Button>
                            </div>
                        ) : isPaymentProcessing ? (
                            <div className="py-24 flex flex-col items-center justify-center space-y-8">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                                    <Lock className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black">Encrypting...</h3>
                                    <p className="text-sm text-slate-500 mt-2">Verifying institutional protocols</p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500">
                                <div className="bg-emerald-500/20 p-6 rounded-full order-none glow-emerald">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-3xl font-black">Success</h3>
                                    <p className="text-slate-500 mt-3 font-medium">Assets settled in your portfolio.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-emerald-500/10 rounded-full blur-[60px] -z-10" />

            </header>

            {error && (
                <div className="glass-morphism p-12 rounded-[3rem] border-rose-500/20 flex flex-col items-center gap-6 text-center animate-in zoom-in">
                    <div className="p-5 bg-rose-500/10 rounded-3xl text-rose-500 scale-125">
                        <Info className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white">Registry Connection Latency</h3>
                        <p className="text-slate-500 font-medium mt-2">Error: {error}</p>
                    </div>
                    <Button onClick={fetchData} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl h-14 px-12 font-black uppercase tracking-widest text-xs">Re-Authenticate</Button>
                </div>
            )}

            <div className="space-y-12">


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {loading ? [1, 2, 3].map(i => <div key={i} className="h-[500px] glass-morphism rounded-[3rem] animate-pulse" />) :
                        projects.map((project, i) => (
                            <Card
                                key={i}
                                onClick={() => { setSelectedProject(project); setIsDetailsOpen(true); }}
                                className={`group glass-morphism border-none rounded-[3rem] overflow-hidden hover:scale-[1.02] transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-900/10 opacity-0 animate-reveal-up delay-${(i + 1) * 200} cursor-pointer`}
                            >
                                <div className="h-60 relative overflow-hidden">
                                    <img src={project.img} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80'; }} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#080c0a] via-transparent to-transparent" />
                                    <div className="absolute top-6 right-6">
                                        <div className="glass-morphism-heavy px-4 py-2 rounded-xl text-[9px] font-black tracking-widest text-emerald-400 border border-emerald-500/20 uppercase">{project.rating}</div>
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">{project.origin} Origin</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Tier-1 Asset</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white leading-tight group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-1">{project.title}</h3>
                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <p className="text-base font-black text-white">{project.price?.split('/')[0]} <span className="text-[10px] text-slate-600 ml-1">/ ton</span></p>
                                        <div className="p-2.5 bg-white/5 rounded-xl text-white/40 group-hover:bg-emerald-500 group-hover:text-[#080c0a] transition-all">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </div>

            <section className="space-y-10 py-12">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-white tracking-tight">Project Pipeline.</h2>
                        <span className="p-1 px-3 glass-morphism rounded-full text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Live Audits</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 px-6 rounded-xl border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-slate-400 hover:text-emerald-400 gap-3 transition-all"
                        onClick={() => handleDownloadCSV(pendingProjects, 'my-portfolio')}
                    >
                        <Download className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Export Portfolio</span>
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                    {pendingProjects.map((p, i) => (
                        <div key={i} className="glass-morphism p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-default">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black">{p.name}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Audit Log: {p.date}</p>
                                </div>
                            </div>
                            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${p.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-500'}`}>
                                {p.status}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Card id="analytics" className="border-none glass-morphism rounded-[4rem] overflow-hidden mt-12 bg-transparent">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between p-16 pb-0">
                    <div>
                        <CardTitle className="text-5xl font-black text-white tracking-tight">Carbon Trajectory.</CardTitle>
                        <CardDescription className="text-slate-500 font-medium text-lg mt-4">Verified institutional offset volume (Metric Tons)</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-16">
                    <div className="h-80 flex items-end gap-5">
                        {monthlyData.map((data, i) => (
                            <div key={i} className="flex-1 group relative h-full">
                                <div className="w-full bg-white/5 rounded-3xl absolute bottom-0 h-full border border-white/5 group-hover:bg-white/10 transition-all" />
                                <div
                                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-3xl transition-all duration-[1.5s] absolute bottom-0 shadow-[0_0_30px_rgba(16,185,129,0.2)] group-hover:scale-y-[1.05] origin-bottom"
                                    style={{ height: `${data.percentage}%` }}
                                />
                                <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-emerald-500 text-[#080c0a] text-xs font-black px-4 py-2 rounded-2xl shadow-2xl z-20 whitespace-nowrap">
                                    {data.volume} tCO2e
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-12 mt-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-center">
                        {monthlyData.map((data, i) => (
                            <span key={i}>{data.month}</span>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BuyerDashboard;
