import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';

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
        <div className="flex justify-center items-center p-6 min-h-screen bg-gray-900 overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-900/50">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\'%3E%3Cpath d=\'M0 .5H31.5V32\'/%3E%3C/svg%3E")', backgroundSize: '16px 16px' }}></div>
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl z-10 border border-white/30 transform transition duration-500 hover:shadow-indigo-500/40">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Welcome Back
                </h2>
                {message && <p className="text-red-500 text-center mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-inner focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-inner focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition transform hover:scale-[1.01]"
                    >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Log In
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-indigo-600 hover:text-purple-600">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;