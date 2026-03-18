import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const LegalDialog = ({ title, icon: Icon, children, open, onOpenChange }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-morphism-heavy border-white/10 text-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 max-w-2xl w-[95vw] sm:w-full overflow-hidden">
            <DialogHeader className="mb-6 sm:mb-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="p-2 sm:p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                        <Icon className="w-5 h-5 sm:w-6 h-6 text-emerald-400" />
                    </div>
                    <DialogTitle className="text-2xl sm:text-4xl font-black tracking-tight text-white">{title}</DialogTitle>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-emerald-500/50 to-transparent" />
            </DialogHeader>
            <div className="space-y-6 text-white/60 font-medium leading-relaxed max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {children}
            </div>
            <div className="mt-10 flex justify-end text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/40">
                VerdiTrust Protocol v4.2.0 • Last Updated Feb 2026
            </div>
        </DialogContent>
    </Dialog>
);

const Footer = () => {
    const [openDialog, setOpenDialog] = useState(null);

    return (
        <footer className="py-20 border-t border-white/5 bg-[#080c0a]">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 text-center md:text-left">
                <Link
                    to="/"
                    className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    <span className="text-lg font-black text-white tracking-tighter">VerdiTrust</span>
                </Link>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-slate-400 max-w-[280px] sm:max-w-none">
                    © 2026 VERDITRUST ECOLOGICAL LEDGER. ALL RIGHTS RESERVED.
                </p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                    <button onClick={() => setOpenDialog('privacy')} className="hover:text-white transition-colors uppercase">Privacy</button>
                    <button onClick={() => setOpenDialog('terms')} className="hover:text-white transition-colors uppercase">Terms</button>
                    <button onClick={() => setOpenDialog('security')} className="hover:text-white transition-colors uppercase">Security</button>
                </div>
            </div>

            {/* Legal Dialogs */}
            <LegalDialog
                title="Privacy Architecture"
                icon={Shield}
                open={openDialog === 'privacy'}
                onOpenChange={(open) => !open && setOpenDialog(null)}
            >
                <div className="space-y-8">
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Data Sovereignty
                        </h4>
                        <p>At VerdiTrust, we implement zero-knowledge protocols for sensitive institutional data. Your corporate information is encrypted at the hardware level and is never accessible to third-party entities without explicit, time-locked authorization.</p>
                    </section>
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> MRV Documentation
                        </h4>
                        <p>Monitoring, Reporting, and Verification (MRV) data is hashed on our secondary ledger. While public indices show verification status, the underlying telemetry remains proprietary to the Project Developer.</p>
                    </section>
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transactional Anonymity
                        </h4>
                        <p>Institutional buyers may opt for "Silent Settlement" where only the volume and vintage are public, while the buyer identity remains hidden on the public block-explorer.</p>
                    </section>
                </div>
            </LegalDialog>

            <LegalDialog
                title="Service Governance"
                icon={FileText}
                open={openDialog === 'terms'}
                onOpenChange={(open) => !open && setOpenDialog(null)}
            >
                <div className="space-y-8">
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Asset Fidelity
                        </h4>
                        <p>All carbon credits listed on VerdiTrust must meet the CCTS India Compliance Framework. Buyers acknowledge that environmental impact is verified by secondary audit logs and satellite telemetry.</p>
                    </section>
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Settlement Finality
                        </h4>
                        <p>Once a "Retirement Sequence" is initiated, the transaction is immutable. Credits are burned in the national registry and a verifiable certificate of impact is issued to the institutional vault.</p>
                    </section>
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Platform Fees
                        </h4>
                        <p>VerdiTrust charges a 2.5% infrastructure fee on successful primary market listings. Secondary trades are subject to a variable protocol fee depending on volume and institutional tier.</p>
                    </section>
                </div>
            </LegalDialog>

            <LegalDialog
                title="Security Protocol"
                icon={Lock}
                open={openDialog === 'security'}
                onOpenChange={(open) => !open && setOpenDialog(null)}
            >
                <div className="space-y-8">
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-Sig Authorization
                        </h4>
                        <p>All institutional withdrawals and credit retirements require multi-signature authorization from verified corporate delegates using our secure vault architecture.</p>
                    </section>
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Penetration Testing
                        </h4>
                        <p>Our infrastructure undergoes weekly autonomous penetration testing and quarterly comprehensive security audits by Tier-1 cybersecurity firms to ensure the integrity of the Ecological Ledger.</p>
                    </section>
                    <section>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cold Storage
                        </h4>
                        <p>95% of active registry keys are held in hardware security modules (HSM) in geographic cold storage, air-gapped from primary network traffic.</p>
                    </section>
                </div>
            </LegalDialog>
        </footer>
    );
};

export default Footer;
