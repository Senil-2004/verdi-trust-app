import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Leaf, ShieldCheck, Factory, Globe, CheckCircle2 } from 'lucide-react';

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

    const validateStep = (currentStep) => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
            if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID / Registration is required';
            if (!formData.website.trim()) {
                newErrors.website = 'Website is required';
            } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) {
                newErrors.website = 'Please enter a valid URL';
            }
        } else if (currentStep === 2) {
            if (!formData.projectLocation.trim()) newErrors.projectLocation = 'Project location is required';
            if (!formData.estimatedCredits) {
                newErrors.estimatedCredits = 'Credits estimate is required';
            } else if (Number(formData.estimatedCredits) <= 0) {
                newErrors.estimatedCredits = 'Must be a positive number';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
    };

    const handleNext = () => {
        if (!validateStep(step)) return;
        if (step < 2) setStep(step + 1);
        else handleSubmit();
    };

    const handleSubmit = async () => {
        try {
            // Update role in database
            await fetch('/api/users/role', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'buyer@verditrust.com', role: 'Project Developer' })
            });

            // Update local state
            localStorage.setItem('isSeller', 'true');
            // Check if we need to update userName role in localStorage? Usually just isSeller flag is enough for the dashboard.

            navigate('/seller');
        } catch (error) {
            console.error("Onboarding error:", error);
            // Fallback navigation even if API fails (e.g. offline dev)
            localStorage.setItem('isSeller', 'true');
            navigate('/seller');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-white to-teal-50">
            <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-teal-600 rounded-2xl shadow-xl shadow-teal-500/20 mb-4">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Become a Verified Seller</h1>
                    <p className="text-slate-500 font-medium">Complete your profile to start issuing carbon credits</p>
                </div>

                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`h-2 w-16 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-teal-600 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 'bg-slate-200'}`} />
                    <div className={`h-2 w-16 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-teal-600 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 'bg-slate-200'}`} />
                </div>

                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                    {step === 1 ? (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <CardHeader className="pb-8">
                                <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                    <Globe className="w-5 h-5 text-teal-600" />
                                    Company Details
                                </CardTitle>
                                <CardDescription className="text-slate-500">Basic information about your organization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName" className={`text-xs font-bold uppercase tracking-wider ${errors.companyName ? 'text-rose-500' : 'text-slate-500'}`}>Legal Company Name</Label>
                                        <Input
                                            id="companyName"
                                            placeholder="Global Reforest Inc."
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className={`h-12 bg-slate-50 border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 ${errors.companyName ? 'border-rose-500 bg-rose-50/30' : ''}`}
                                        />
                                        {errors.companyName && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none mt-1">{errors.companyName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="taxId" className={`text-xs font-bold uppercase tracking-wider ${errors.taxId ? 'text-rose-500' : 'text-slate-500'}`}>Business Registration ID</Label>
                                        <Input
                                            id="taxId"
                                            placeholder="TAX-990-21"
                                            value={formData.taxId}
                                            onChange={handleInputChange}
                                            className={`h-12 bg-slate-50 border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 ${errors.taxId ? 'border-rose-500 bg-rose-50/30' : ''}`}
                                        />
                                        {errors.taxId && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none mt-1">{errors.taxId}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website" className={`text-xs font-bold uppercase tracking-wider ${errors.website ? 'text-rose-500' : 'text-slate-500'}`}>Company Website</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://example.com"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className={`h-12 bg-slate-50 border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 ${errors.website ? 'border-rose-500 bg-rose-50/30' : ''}`}
                                    />
                                    {errors.website && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none mt-1">{errors.website}</p>}
                                </div>
                            </CardContent>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <CardHeader className="pb-8">
                                <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                                    Verification Details
                                </CardTitle>
                                <CardDescription className="text-slate-500">Information needed for initial project review</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="projectType" className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Project Type</Label>
                                    <select
                                        id="projectType"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-teal-500 transition-all outline-none text-slate-900"
                                        value={formData.projectType}
                                        onChange={handleInputChange}
                                    >
                                        <option>Reforestation</option>
                                        <option>Renewable Energy</option>
                                        <option>Methane Capture</option>
                                        <option>Blue Carbon</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="projectLocation" className={`text-xs font-bold uppercase tracking-wider ${errors.projectLocation ? 'text-rose-500' : 'text-slate-500'}`}>Main Project Location</Label>
                                        <Input
                                            id="projectLocation"
                                            placeholder="Amazon Basin, Brazil"
                                            value={formData.projectLocation}
                                            onChange={handleInputChange}
                                            className={`h-12 bg-slate-50 border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 ${errors.projectLocation ? 'border-rose-500 bg-rose-50/30' : ''}`}
                                        />
                                        {errors.projectLocation && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none mt-1">{errors.projectLocation}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="estimatedCredits" className={`text-xs font-bold uppercase tracking-wider ${errors.estimatedCredits ? 'text-rose-500' : 'text-slate-500'}`}>Estimated Annual Credits</Label>
                                        <Input
                                            id="estimatedCredits"
                                            type="number"
                                            placeholder="50000"
                                            value={formData.estimatedCredits}
                                            onChange={handleInputChange}
                                            className={`h-12 bg-slate-50 border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 ${errors.estimatedCredits ? 'border-rose-500 bg-rose-50/30' : ''}`}
                                        />
                                        {errors.estimatedCredits && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none mt-1">{errors.estimatedCredits}</p>}
                                    </div>
                                </div>
                                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5" />
                                    <p className="text-xs text-teal-800 leading-relaxed font-medium">
                                        By clicking "Complete Application", your account will be converted to a Project Developer role. You will be able to register projects and manage credit issuance.
                                    </p>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    <CardFooter className="bg-slate-50/50 p-8 border-t border-slate-50 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={() => step > 1 ? setStep(1) : navigate(-1)}
                            className="text-slate-500 font-bold"
                        >
                            {step === 1 ? 'Cancel' : 'Go Back'}
                        </Button>
                        <Button
                            onClick={handleNext}
                            variant="primary"
                            className="px-10 h-12 shadow-teal-500/20"
                        >
                            {step === 1 ? 'Next Step' : 'Complete Application'}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="mt-8 flex justify-center gap-8 opacity-40 grayscale pointer-events-none">
                    <Factory className="w-6 h-6" />
                    <Globe className="w-6 h-6" />
                    <ShieldCheck className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default SellerOnboarding;
