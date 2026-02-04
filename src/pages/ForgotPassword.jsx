import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        if (!email) {
            setError("Please enter your email address.");
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (err) {
            console.error("Error sending reset email:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                    <CardTitle className="text-3xl text-gray-800">Reset Password</CardTitle>
                    <CardDescription>Enter your email to receive reset instructions</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        {message && (
                            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full bg-green-600" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>

                        <div className="text-center">
                            <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
