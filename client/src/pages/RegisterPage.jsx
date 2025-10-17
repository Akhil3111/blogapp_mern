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
            auth.login(data.token, data.user);
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center p-6 min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 to-indigo-900/50">
            {/* ... (The background div with grid pattern) ... */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl z-10 border border-white/30">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Join Quickblog
                </h2>
                {message && <p className="text-red-500 text-center mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-inner"
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-inner"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Sign Up
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-purple-600">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;