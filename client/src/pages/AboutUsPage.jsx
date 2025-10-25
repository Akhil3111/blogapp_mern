// client/src/pages/AboutUsPage.jsx

import React from 'react';
import AppNavbar from '../components/AppNavbar'; // Assuming you want the regular navbar
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth'; // Needed for AppNavbar

const AboutUsPage = () => {
    const { user, logout, isAuthenticated } = useAuth(); // For AppNavbar props

    return (
        <div className="min-h-screen flex flex-col">
            <AppNavbar user={user} isAuthenticated={isAuthenticated} logout={logout} />
            <main className="flex-grow max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About Quickblog</h1>
                <p className="text-lg text-gray-700 mb-4">
                    Quickblog is a modern blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js).
                    Our goal is to provide a seamless and intuitive experience for creators to share their stories and for readers to discover engaging content.
                </p>
                <p className="text-md text-gray-600 mb-8">
                    Developed by a dedicated team of two, this project showcases our passion for full-stack web development and our commitment to creating user-friendly applications.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-md text-gray-600 mb-8">
                    To empower individuals to express themselves freely and connect with a wider audience through a robust, scalable, and secure platform.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-md text-gray-600">
                    Have questions or feedback? Feel free to reach out to us at <a href="mailto:contact@quickblog.com" className="text-indigo-600 hover:underline">contact@quickblog.com</a>.
                </p>
                {/* You can add more team-specific info or project goals here */}
            </main>
            <Footer />
        </div>
    );
};

export default AboutUsPage;