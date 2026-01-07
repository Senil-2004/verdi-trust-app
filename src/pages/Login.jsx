import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

return (
    <div style={{ padding: 40, background: 'red', color: 'white', fontSize: 32 }}>
        THIS IS LOGIN.JSX — IF YOU SEE THIS, FILE IS ACTIVE
    </div>
);

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (role === 'developer') navigate('/developer');
        else if (role === 'buyer') navigate('/buyer');
        else if (role === 'admin') navigate('/admin');
    };

    const handleGoogleSignIn = () => {
        if (!role) {
            alert('Please select a role first');
            return;
        }
        alert(`Google Sign-In as ${role}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-green-100 p-6">
            <Card className="w-full max-w-md shadow-2xl rounded-2xl border-green-100">
                <CardHeader className="text-center space-y-3 pb-6">
                    <div className="flex justify-center mb-2">
                        <div className="bg-gradient-to-br from-green-500 to-teal-600 p-4 rounded-2xl shadow-lg">
                            <Leaf className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl text-gray-800">VerdiTrust</CardTitle>
                    <CardDescription>Carbon Credit Management Platform</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <Label>Email Address</Label>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div>
                            <Label>Password</Label>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div>
                            <Label>Select Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="developer">Project Developer</SelectItem>
                                    <SelectItem value="buyer">Carbon Credit Buyer</SelectItem>
                                    <SelectItem value="admin">Platform Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ✅ GOOGLE BUTTON IN CORRECT PLACE */}
                        <Button
                            type="button"
                            disabled={!role}
                            onClick={handleGoogleSignIn}
                            className="w-full bg-white text-gray-800 border"
                        >
                            Sign in with Google
                        </Button>

                        {!role && (
                            <p className="text-xs text-red-500 text-center">
                                Please select a role before using Google Sign-In
                            </p>
                        )}

                        <Button type="submit" className="w-full bg-green-600">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
