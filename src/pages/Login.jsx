import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, CheckCircle, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { auth, db } from '../firebase';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export function LoginPage() {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Validation State
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    // Validation Rules
    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'email':
                if (!value) error = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
                break;
            case 'password':
                if (!value) error = 'Password is required';
                else if (value.length < 6) error = 'Must be at least 6 characters';
                break;
            case 'confirmPassword':
                if (isSignUp && value !== formData.password) error = 'Passwords do not match';
                break;
            case 'name':
                if (isSignUp && !value) error = 'Full name is required';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Live Validation
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));

        // Special case for confirm password to re-validate if password changes
        if (name === 'password' && isSignUp) {
            if (formData.confirmPassword) {
                const confirmError = value !== formData.confirmPassword ? 'Passwords do not match' : '';
                setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
            }
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const isValid = (name) => {
        return touched[name] && !errors[name] && formData[name];
    };

    const isInvalid = (name) => {
        return touched[name] && errors[name];
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (!isSignUp && (key === 'name' || key === 'confirmPassword')) return;
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);
        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true
        });

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);

        try {
            if (isSignUp) {
                // Create New Account
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                // Save to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    name: formData.name,
                    email: formData.email,
                    role: localStorage.getItem('isSeller') === 'true' ? 'seller' : 'buyer',
                    createdAt: new Date().toISOString()
                });

                localStorage.setItem('userName', formData.name);
                console.log("Firebase Account & DB Entry Created");
            } else {
                // Login Existing User
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                localStorage.setItem('userName', formData.email.split('@')[0]);
                console.log("Firebase Login Success");
            }

            // Navigation Logic
            if (formData.email === 'admin@verditrust.com') {
                navigate('/admin');
            } else {
                const isSeller = localStorage.getItem('isSeller') === 'true';
                navigate(isSeller ? '/seller' : '/buyer');
            }
        } catch (error) {
            console.error("Firebase Auth Failed:", error);
            setErrors(prev => ({ ...prev, auth: error.message }));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem('userName', result.user.displayName || result.user.email.split('@')[0]);

            if (result.user.email === 'admin@verditrust.com') {
                navigate('/admin');
            } else {
                const isSeller = localStorage.getItem('isSeller') === 'true';
                navigate(isSeller ? '/seller' : '/buyer');
            }

        } catch (error) {
            console.error("Firebase Google Login Failed:", error);
            alert(`Google Sign-In failed: ${error.message}`);
        }
    };

    // Helper to get input styles
    const getInputStyles = (name) => {
        if (isInvalid(name)) return 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500 focus:ring-rose-500/20';
        if (isValid(name)) return 'border-emerald-500/50 bg-emerald-500/5 focus:border-emerald-500 focus:ring-emerald-500/20';
        return 'bg-slate-900/50 border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/20';
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#080c0a] overflow-hidden">
            {/* Left Side: atmospheric Visuals */}
            <div className="hidden md:flex md:w-[55%] relative group overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c0a] via-[#080c0a]/40 to-transparent" />
                <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay" />

                <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30">
                            <Leaf className="w-8 h-8 text-emerald-400" />
                        </div>
                        <span className="text-3xl font-black text-white tracking-tight">VerdiTrust</span>
                    </div>

                    <div className="max-w-xl animate-in fade-in slide-in-from-left-10 duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 transition-all hover:bg-emerald-500/20 cursor-default">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Join the Carbon Revolution</span>
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[1.1] mb-6">
                            Secure your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">planet's legacy</span> today.
                        </h2>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
                            VerdiTrust connects the world's most innovative reforestation projects with visionary corporate stewards.
                            Trade verified carbon assets with institutional-grade security.
                        </p>

                        <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                            <div>
                                <p className="text-3xl font-black text-white tracking-tight">1.2M+</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tons Offset</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white tracking-tight">450+</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Projects</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Authentication Form */}
            <div className="w-full md:w-[45%] flex items-center justify-center p-8 relative">
                {/* Decorative blob in background */}
                <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-teal-500/5 rounded-full blur-[100px]" />

                <div className="w-full max-w-md opacity-0 animate-reveal-up delay-200">
                    <div className="mb-10 text-center md:text-left">
                        <div className="md:hidden flex justify-center mb-6">
                            <Leaf className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                            {isSignUp ? 'Create Impact Account' : 'Welcome back'}
                        </h1>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            {isSignUp ? 'Begin your journey as a verified carbon steward' : 'Access your global offset portfolio and dashboard'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {errors.auth && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center flex items-center gap-2 justify-center animate-in shake">
                                <AlertCircle className="w-4 h-4" />
                                {errors.auth}
                            </div>
                        )}

                        {isSignUp && (
                            <div className="space-y-2 group">
                                <Label className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isInvalid('name') ? 'text-rose-400' : isValid('name') ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isInvalid('name') ? 'text-rose-400' : isValid('name') ? 'text-emerald-400' : 'text-slate-600'}`} />
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`h-14 px-12 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 transition-all ${getInputStyles('name')}`}
                                        placeholder="Enter your name"
                                    />
                                    {isValid('name') && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-in fade-in zoom-in" />}
                                    {isInvalid('name') && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 animate-in fade-in zoom-in" />}
                                </div>
                                {isInvalid('name') && <p className="text-[10px] text-rose-400 font-bold ml-1 animate-in slide-in-from-left-2">{errors.name}</p>}
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <Label className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isInvalid('email') ? 'text-rose-400' : isValid('email') ? 'text-emerald-400' : 'text-slate-500'}`}>
                                Corporate Email
                            </Label>
                            <div className="relative">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isInvalid('email') ? 'text-rose-400' : isValid('email') ? 'text-emerald-400' : 'text-slate-600'}`} />
                                <Input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`h-14 px-12 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 transition-all ${getInputStyles('email')}`}
                                    placeholder="name@corporation.com"
                                />
                                {isValid('email') && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-in fade-in zoom-in" />}
                                {isInvalid('email') && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 animate-in fade-in zoom-in" />}
                            </div>
                            {isInvalid('email') && <p className="text-[10px] text-rose-400 font-bold ml-1 animate-in slide-in-from-left-2">{errors.email}</p>}
                        </div>

                        <div className="space-y-2 group">
                            <div className="flex justify-between items-center mb-1">
                                <Label className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isInvalid('password') ? 'text-rose-400' : isValid('password') ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    Password
                                </Label>
                                {!isSignUp && (
                                    <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">
                                        Forgot Key?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isInvalid('password') ? 'text-rose-400' : isValid('password') ? 'text-emerald-400' : 'text-slate-600'}`} />
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`h-14 px-12 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 transition-all ${getInputStyles('password')}`}
                                    placeholder="••••••••"
                                />
                                {isValid('password') && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-in fade-in zoom-in" />}
                                {isInvalid('password') && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 animate-in fade-in zoom-in" />}
                            </div>
                            {isInvalid('password') && <p className="text-[10px] text-rose-400 font-bold ml-1 animate-in slide-in-from-left-2">{errors.password}</p>}
                        </div>

                        {isSignUp && (
                            <div className="space-y-2 group">
                                <Label className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isInvalid('confirmPassword') ? 'text-rose-400' : isValid('confirmPassword') ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    Verify Password
                                </Label>
                                <div className="relative">
                                    <CheckCircle className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isInvalid('confirmPassword') ? 'text-rose-400' : isValid('confirmPassword') ? 'text-emerald-400' : 'text-slate-600'}`} />
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`h-14 px-12 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 transition-all ${getInputStyles('confirmPassword')}`}
                                        placeholder="••••••••"
                                    />
                                    {isValid('confirmPassword') && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-in fade-in zoom-in" />}
                                    {isInvalid('confirmPassword') && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 animate-in fade-in zoom-in" />}
                                </div>
                                {isInvalid('confirmPassword') && <p className="text-[10px] text-rose-400 font-bold ml-1 animate-in slide-in-from-left-2">{errors.confirmPassword}</p>}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg transition-all shadow-xl shadow-emerald-900/20 mt-6 active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Synchronizing...</span>
                                </div>
                            ) : (
                                <span>{isSignUp ? 'Establish Primary Access' : 'Authenticate Dashboard'}</span>
                            )}
                        </Button>

                        <div className="relative my-10 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-800"></div>
                            </div>
                            <span className="relative z-10 px-6 bg-[#080c0a] text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Institutional Single Sign-On</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full h-14 rounded-2xl bg-white/5 border border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white font-bold transition-all flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="text-center mt-10">
                            <p className="text-xs text-slate-500 font-medium mb-3">
                                {isSignUp ? 'Already a registered stakeholder?' : 'New to the VerdiTrust platform?'}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setErrors({});
                                    setTouched({});
                                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                                }}
                                className="text-sm font-black text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] border-b-2 border-emerald-500/20 pb-1"
                            >
                                {isSignUp ? 'Access Portal Login' : "Request New Hub Access"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
