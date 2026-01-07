import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Navbar = () => (
    <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 22h20" />
                    <path d="M12 22v-9" />
                    <path d="M9 10a3 3 0 0 1 3-3 3 3 0 0 1 3 3v3" />
                </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">VerdiTrust</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">Marketplace</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Solutions</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Resources</a>
        </div>
        <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">
                Log in
            </Link>
            <Link to="/login">
                <Button className="!w-auto px-6 h-10 text-sm">Get Started</Button>
            </Link>
        </div>
    </nav>
);

const Hero = () => (
    <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 border border-green-200 text-green-700 text-xs font-semibold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Carbon Marketplace
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                    Trust in every <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                        carbon credit
                    </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                    VerdiTrust validates, tracks, and trades premium carbon credits with transparent blockchain technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/login">
                        <Button className="!w-auto px-8 shadow-xl shadow-green-500/20">Start Trading</Button>
                    </Link>
                    <button className="h-12 px-8 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        View Documentation
                    </button>
                </div>
            </div>

            {/* Abstract Visual / Hero Image Placeholder */}
            <div className="flex-1 relative">
                <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-teal-300 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                    <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl shadow-green-900/5 rotate-[-5deg] hover:rotate-0 transition-all duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <span className="text-green-600 font-bold">+24.5%</span>
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200/50 rounded-full w-3/4"></div>
                            <div className="h-4 bg-gray-200/50 rounded-full w-1/2"></div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Total Offset</span>
                                <span className="font-bold text-gray-900">1,240 tCO2e</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Features = () => (
    <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Smart Verification", desc: "AI-driven validation ensures 100% authenticity of every credit.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                    { title: "Real-time Tracking", desc: "Monitor your carbon offset impact in real-time dashboards.", icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" },
                    { title: "Global Marketplace", desc: "Access premium projects from accredited partners worldwide.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" }
                ].map((feature, i) => (
                    <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
)

const Footer = () => (
    <footer className="py-12 border-t border-gray-200/60 text-center">
        <p className="text-gray-500 text-sm">© 2024 VerdiTrust Inc. All rights reserved.</p>
    </footer>
)

const Landing = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </div>
    );
};

export default Landing;
