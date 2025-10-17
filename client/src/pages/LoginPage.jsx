import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';

// CORRECTED GoogleIcon component
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.617-3.26-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.986,36.697,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const data = await loginUser({ email, password });
            auth.login(data.token, data.user);
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Login</h1>
                    <p className="text-gray-500 mt-2">Enter your email below to login to your account</p>
                </div>
                
                {message && <p className="text-red-500 text-center text-sm mb-4">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                        <input
                            id="email" type="email" placeholder="m@example.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                            <a href="#" className="text-sm text-gray-600 hover:underline">Forgot your password?</a>
                        </div>
                        <input
                            id="password" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full flex justify-center items-center py-2.5 px-4 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition"
                    >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Login
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">OR CONTINUE WITH</span>
                    </div>
                </div>

                <div>
                    <button className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition">
                        <GoogleIcon />
                        Login with Google
                    </button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-8">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-gray-800 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;