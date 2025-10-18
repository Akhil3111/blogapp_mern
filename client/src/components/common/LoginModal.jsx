import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogin = () => {
        navigate('/login');
        onClose();
    };

    const handleRegister = () => {
        navigate('/register');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
                <div className="flex justify-end p-2">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center px-6 pb-8">
                    <LogIn className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Join to Read</h3>
                    <p className="text-gray-600 mb-6">Please log in or create an account to read the full post, like, and comment.</p>
                    
                    <div className="space-y-3">
                        <button
                            onClick={handleLogin}
                            className="w-full flex justify-center items-center py-2.5 px-4 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800"
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Login
                        </button>
                        <button
                            onClick={handleRegister}
                            className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;