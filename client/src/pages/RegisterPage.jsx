import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
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
            const data = await registerUser({ username, email, password });
            // After successful registration, log the user in automatically
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
                    <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                    <p className="text-gray-500 mt-2">Enter your details below to create your account</p>
                </div>
                
                {message && <p className="text-red-500 text-center text-sm mb-4">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
                        <input
                            id="username" type="text" placeholder="your_username"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                        />
                    </div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                        <input
                            id="password" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full flex justify-center items-center py-2.5 px-4 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition"
                    >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Create Account
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-gray-800 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;