import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './LandingNavbar';
import Footer from './Footer';

const HomeLayout = () => {
    return (
        <div className="bg-white">
            <Navbar />
            <main className="pt-16">
                <Outlet /> {/* This will render the specific page content */}
            </main>
            <Footer />
        </div>
    );
};

export default HomeLayout;