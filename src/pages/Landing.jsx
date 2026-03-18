import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
    Shield,
    Globe,
    Zap,
    ArrowRight,
    ChevronRight,
    FileText,
    Activity,
    Cpu,
    Wallet,
    Users,
    Lock,
    HelpCircle,
    TreePine,
    AlertTriangle,
    CheckCircle2,
    BarChart3,
    Search,
    TrendingUp
} from 'lucide-react';

const Hero = () => (
    <section className="relative pt-32 pb-16 md:pt-64 md:pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] -z-10 animate-float" />

        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full glass-morphism border-white/10 mb-8 sm:mb-12 opacity-0 animate-reveal-up">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">CCTS INDIA COMPLIANT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter mb-6 sm:mb-10 opacity-0 animate-reveal-up delay-200 text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/40 drop-shadow-2xl">
                Scaling Trust <br className="hidden sm:block" />
                <span className="italic opacity-80">in the Future.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed font-medium mb-10 sm:mb-16 opacity-0 animate-reveal-up delay-400 px-4">
                VerdiTrust is a unified digital platform streamlining the carbon credit lifecycle.
                From project registration to final retirement, we bridge the gap between
                environmental impact and national compliance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 opacity-0 animate-reveal-up delay-600">
                <Link to="/login" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 rounded-2xl bg-white/90 text-[#080c0a] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-400/10 active:scale-[0.95] group backdrop-blur-md">
                        Initialize Terminal <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    </section>
);

const Challenges = () => (
    <section id="challenges" className="py-20 md:py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-24 items-center">
                <div className="opacity-0 animate-reveal-up">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-10 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                        The Carbon Gap.
                    </h2>
                    <p className="text-base text-white/70 leading-relaxed font-medium mb-16 max-w-lg">
                        Despite the growth of Indian and global carbon markets, the landscape remains restricted by
                        critical inefficiencies. VerdiTrust solves these core barriers today.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {[
                            { title: "Fragmented Verification", icon: AlertTriangle },
                            { title: "Limited Accessibility", icon: Users },
                            { title: "Price Opacity", icon: BarChart3 },
                            { title: "Low Authenticity Trust", icon: Shield }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white/60 group-hover:text-rose-400 transition-colors">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/60 group-hover:text-white/90 transition-colors">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative group opacity-0 animate-reveal-up delay-400">
                    <div className="absolute -inset-10 bg-emerald-500/5 rounded-full blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-1000" />
                    <div className="glass-morphism rounded-[4rem] p-16 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
                        <p className="text-xl text-white/70 font-medium italic leading-relaxed mb-12 relative z-10">
                            "The carbon credit ecosystem is expanding rapidly... but fragmented processes
                            hinder small project developers and corporate buyers alike."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const UserRoles = () => (
    <section id="roles" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-32 opacity-0 animate-reveal-up">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">Unified Ecosystem.</h2>
                <p className="text-base text-white/60 max-w-2xl mx-auto font-medium">Three primary pillars interacting on a single, secure ledger.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
                {[
                    {
                        title: "Project Developers",
                        role: "Supply Side",
                        desc: "Register energy projects, upload MRV documentation, and list verified assets for sale.",
                        icon: TreePine,
                        color: "from-emerald-400/80 to-emerald-400/20"
                    },
                    {
                        title: "Institutional Buyers",
                        role: "Demand Side",
                        desc: "Browse verified projects, purchase credits, and receive tamper-proof digital certificates.",
                        icon: Wallet,
                        color: "from-blue-400/80 to-blue-400/20"
                    },
                    {
                        title: "Administrators",
                        role: "Governance",
                        desc: "Oversee operations, manage workflows, and ensure national compliance.",
                        icon: Lock,
                        color: "from-purple-400/80 to-purple-400/20"
                    }
                ].map((item, i) => (
                    <div key={i} className="p-16 rounded-[4rem] glass-morphism border-white/5 hover:bg-white/[0.04] transition-all group opacity-0 animate-reveal-up delay-200">
                        <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-12 group-hover:scale-110 transition-transform">
                            <item.icon className="w-8 h-8 text-white/60 group-hover:text-white/90 transition-colors" />
                        </div>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 tracking-tight mb-6">{item.title}</h3>
                        <p className="text-base text-white/70 leading-relaxed font-medium mb-10">{item.desc}</p>
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-white/40 group-hover:text-white/80 transition-colors">
                            Access Portal <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section id="methodology" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-40 opacity-0 animate-reveal-up">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">Carbon Lifecycle.</h2>
                <p className="text-base text-white/60 max-w-2xl mx-auto font-medium">A standardized, automated path for credit verification.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-12">
                {[
                    { step: "01", title: "Ingestion", desc: "Energy providers register projects through the secure module.", icon: FileText },
                    { step: "02", title: "Submission", desc: "Autonomous upload of MRV documentation for vetting.", icon: Activity },
                    { step: "03", title: "Issuance", desc: "Administrators approve workflows, issuing verified credits.", icon: Cpu },
                    { step: "04", title: "Retirement", desc: "Final settlement with verifiable impact certificates.", icon: Zap }
                ].map((item, i) => (
                    <div key={i} className="relative opacity-0 animate-reveal-up delay-200">
                        <div className="text-[80px] font-black text-white/5 absolute -top-16 -left-4 pointer-events-none select-none">
                            {item.step}
                        </div>
                        <h3 className="text-2xl font-black text-white/80 mb-6 tracking-tight relative z-10">{item.title}</h3>
                        <p className="text-white/70 text-sm leading-relaxed font-medium relative z-10">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Landing = () => {
    return (
        <div className="bg-[#080c0a] min-h-screen selection:bg-emerald-500/30">
            <Hero />
            <Challenges />
            <UserRoles />
            <HowItWorks />

            <section className="py-60 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative glass-morphism-heavy rounded-[5rem] p-32 overflow-hidden text-center border-white/5 opacity-0 animate-reveal-up">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/50">
                            The New <br />
                            <span className="italic opacity-60">Economy.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                            <Link to="/login">
                                <Button className="h-16 px-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-[0.15em] shadow-2xl shadow-emerald-900/30 active:scale-[0.95] backdrop-blur-xl border border-white/10">
                                    Establish Access
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
