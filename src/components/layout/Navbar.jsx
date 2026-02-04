import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Leaf, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Core Gap', href: '/#challenges' },
        { name: 'Ecosystem', href: '/#roles' },
        { name: 'Methodology', href: '/#methodology' }
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4 px-6' : 'py-8 px-6'}`}>
            <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 ${isScrolled ? 'glass-morphism-heavy px-6 py-3 rounded-2xl shadow-emerald-900/10' : 'glass-morphism px-8 py-5 rounded-[2rem] border-white/5 shadow-2xl skew-x-0'}`}>
                <Link
                    to="/"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
                        <Leaf className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">VerdiTrust</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-emerald-400 transition-all duration-300 hover:scale-105"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <Button className="h-12 px-8 rounded-2xl bg-white/10 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 hover:border-emerald-500/50 transition-all duration-500 shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98]">
                            Establish Access
                        </Button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-6 right-6 mt-4 glass-morphism-heavy rounded-3xl p-8 md:hidden animate-reveal-up border border-white/5">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xs font-black uppercase tracking-[0.2em] text-white/60 hover:text-emerald-400 transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}
                        <hr className="border-white/5" />
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                        >
                            Establish Access
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
