import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Leaf, ShieldCheck, Globe, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SPECIAL_CHARS = /[+\-*/\\=@#$%^&!~`|<>{}[\]()]/;
const SPACES_ONLY = /^\s+$/;

const SellerOnboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        website: '',
        projectLocation: '',
        projectType: 'Reforestation',
        estimatedCredits: '',
        taxId: ''
    });
    const [errors, setErrors] = useState({});

    const validateField = (id, value) => {
        if (SPACES_ONLY.test(value)) return 'Cannot be only spaces';
        if (id === 'companyName') {
            if (!value.trim()) return 'Company name is required';
            if (SPECIAL_CHARS.test(value)) return 'No special characters allowed (+, -, *, / etc.)';
            if (value.trim().length < 2) return 'Must be at least 2 characters';
        }
        if (id === 'taxId') {
            if (!value.trim()) return 'Registration ID is required';
            if (/\s/.test(value)) return 'No spaces allowed in registration ID';
            if (/[*\/\\+=#$%^&!~`|<>{}[\]()]/.test(value)) return 'No special characters like *, /, +, = etc.';
        }
        if (id === 'website') {
            if (!value.trim()) return 'Website is required';
            if (/\s/.test(value)) return 'No spaces allowed in URL';
            if (!/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(value)) return 'Enter a valid URL';
        }
        if (id === 'projectLocation') {
            if (!value.trim()) return 'Project location is required';
            if (SPECIAL_CHARS.test(value)) return 'No special characters allowed';
        }
        if (id === 'estimatedCredits') {
            if (!value) return 'Credits estimate is required';
            if (/\s/.test(value)) return 'No spaces allowed';
            if (Number(value) <= 0) return 'Must be a positive number';
            if (!/^\d+$/.test(value)) return 'Only whole numbers allowed';
        }
        return '';
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        const fields = currentStep === 1
            ? ['companyName', 'taxId', 'website']
            : ['projectLocation', 'estimatedCredits'];

        fields.forEach(field => {
            const err = validateField(field, formData[field]);
            if (err) newErrors[field] = err;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Live validation — clear error on valid input
        const err = validateField(id, value);
        setErrors(prev => ({ ...prev, [id]: err }));
    };

    const handleNext = () => {
        if (!validateStep(step)) return;
        if (step < 2) setStep(step + 1);
        else handleSubmit();
    };

    const handleSubmit = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (email) {
                await supabase.from('users').update({ role: 'Project Developer' }).eq('email', email);
            }
            localStorage.setItem('isSeller', 'true');
            navigate('/seller', { replace: true });
        } catch (error) {
            console.error("Onboarding error:", error);
            localStorage.setItem('isSeller', 'true');
            navigate('/seller', { replace: true });
        }
    };

    const inputClass = (field) =>
        `h-14 bg-white/5 border ${errors[field] ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10'} rounded-2xl px-5 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all outline-none`;

    return (
        <div className="flex items-center justify-center p-6 md:p-12 min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/20 mb-5">
                        <Leaf className="w-7 h-7 text-[#080c0a]" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Become a Verified Seller</h1>
                    <p className="text-slate-500 font-medium mt-2">Complete your profile to start issuing carbon credits</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${step >= 1 ? 'bg-emerald-500 text-[#080c0a] shadow-lg shadow-emerald-500/30' : 'bg-white/10 text-slate-600'}`}>1</div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>Company</span>
                    </div>
                    <div className={`h-px w-12 transition-colors duration-500 ${step >= 2 ? 'bg-emerald-500' : 'bg-white/10'}`} />
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${step >= 2 ? 'bg-emerald-500 text-[#080c0a] shadow-lg shadow-emerald-500/30' : 'bg-white/10 text-slate-600'}`}>2</div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>Verification</span>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="border-none glass-morphism rounded-[2.5rem] overflow-hidden">
                    {step === 1 ? (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <CardHeader className="pb-6 px-8 pt-8">
                                <CardTitle className="text-lg font-black flex items-center gap-3 text-white">
                                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    Company Details
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium ml-11">Basic information about your organization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5 px-8 pb-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName" className={`text-[10px] font-black uppercase tracking-[0.15em] ${errors.companyName ? 'text-rose-400' : 'text-slate-500'}`}>Legal Company Name</Label>
                                        <Input
                                            id="companyName"
                                            placeholder="Global Reforest Inc."
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className={inputClass('companyName')}
                                        />
                                        {errors.companyName && <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1.5 mt-1"><AlertCircle className="w-3 h-3" />{errors.companyName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="taxId" className={`text-[10px] font-black uppercase tracking-[0.15em] ${errors.taxId ? 'text-rose-400' : 'text-slate-500'}`}>Business Registration ID</Label>
                                        <Input
                                            id="taxId"
                                            placeholder="TAX99021"
                                            value={formData.taxId}
                                            onChange={handleInputChange}
                                            className={inputClass('taxId')}
                                        />
                                        {errors.taxId && <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1.5 mt-1"><AlertCircle className="w-3 h-3" />{errors.taxId}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website" className={`text-[10px] font-black uppercase tracking-[0.15em] ${errors.website ? 'text-rose-400' : 'text-slate-500'}`}>Company Website</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://example.com"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className={inputClass('website')}
                                    />
                                    {errors.website && <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1.5 mt-1"><AlertCircle className="w-3 h-3" />{errors.website}</p>}
                                </div>
                            </CardContent>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <CardHeader className="pb-6 px-8 pt-8">
                                <CardTitle className="text-lg font-black flex items-center gap-3 text-white">
                                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    Verification Details
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium ml-11">Information needed for project review</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5 px-8 pb-2">
                                <div className="space-y-2">
                                    <Label htmlFor="projectType" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Primary Project Type</Label>
                                    <select
                                        id="projectType"
                                        className="w-full h-14 px-5 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500/30 transition-all outline-none appearance-none"
                                        value={formData.projectType}
                                        onChange={handleInputChange}
                                    >
                                        <option className="bg-[#080c0a]">Reforestation</option>
                                        <option className="bg-[#080c0a]">Renewable Energy</option>
                                        <option className="bg-[#080c0a]">Methane Capture</option>
                                        <option className="bg-[#080c0a]">Blue Carbon</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="projectLocation" className={`text-[10px] font-black uppercase tracking-[0.15em] ${errors.projectLocation ? 'text-rose-400' : 'text-slate-500'}`}>Main Project Location</Label>
                                        <Input
                                            id="projectLocation"
                                            placeholder="Amazon Basin, Brazil"
                                            value={formData.projectLocation}
                                            onChange={handleInputChange}
                                            className={inputClass('projectLocation')}
                                        />
                                        {errors.projectLocation && <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1.5 mt-1"><AlertCircle className="w-3 h-3" />{errors.projectLocation}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="estimatedCredits" className={`text-[10px] font-black uppercase tracking-[0.15em] ${errors.estimatedCredits ? 'text-rose-400' : 'text-slate-500'}`}>Est. Annual Credits (tCO2e)</Label>
                                        <Input
                                            id="estimatedCredits"
                                            type="text"
                                            placeholder="50000"
                                            value={formData.estimatedCredits}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Only allow digits
                                                if (val === '' || /^\d+$/.test(val)) {
                                                    handleInputChange(e);
                                                }
                                            }}
                                            className={inputClass('estimatedCredits')}
                                        />
                                        {errors.estimatedCredits && <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1.5 mt-1"><AlertCircle className="w-3 h-3" />{errors.estimatedCredits}</p>}
                                    </div>
                                </div>
                                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        By completing this application, your account will be upgraded to a Seller role. You'll be able to list carbon credit offerings on the marketplace.
                                    </p>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    <CardFooter className="px-8 py-6 border-t border-white/5 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={() => step > 1 ? setStep(1) : navigate(-1)}
                            className="h-12 px-6 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {step === 1 ? 'Cancel' : 'Back'}
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="h-12 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/30 transition-all active:scale-[0.98] flex items-center gap-2"
                        >
                            {step === 1 ? 'Next Step' : 'Complete Application'}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SellerOnboarding;
