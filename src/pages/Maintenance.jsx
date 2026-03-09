import React from 'react';
import { ShieldAlert, Globe, Lock, Clock } from 'lucide-react';

const Maintenance = () => {
    return (
        <div className="min-h-screen bg-[#080c0a] flex items-center justify-center p-6 font-['Outfit'] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="fixed top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-2xl w-full glass-morphism rounded-[3rem] p-8 sm:p-16 border border-white/10 text-center animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse" />
                        <div className="relative bg-white/5 border border-amber-500/30 p-6 rounded-3xl">
                            <ShieldAlert className="w-16 h-16 text-amber-500" />
                        </div>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">System Protocol: Maintenance</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
                    Site Offline.
                </h1>

                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-lg mx-auto">
                    Global registry updates are currently in progress. The VerdiTrust platform will be back online shortly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: Globe, label: 'Global Access', value: 'Paused' },
                        { icon: Lock, label: 'Registry Security', value: 'Active' },
                        { icon: Clock, label: 'Resumption', value: 'TBD' }
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                            <item.icon className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-sm font-black text-white">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/10">
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">
                        Institutional Grade Security & Compliance Registry
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
