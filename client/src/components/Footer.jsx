// client/src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Linkedin } from 'lucide-react'; // Assuming you have these icons

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Left Section: Copyright & Brand */}
        <div className="text-center md:text-left">
          <Link to="/" className="text-xl font-bold text-indigo-400 hover:text-indigo-300">Quickblog</Link>
          <p className="mt-2 text-sm text-gray-400">&copy; {new Date().getFullYear()} Quickblog. All rights reserved.</p>
        </div>

        {/* Middle Section: Navigation Links */}
        <nav className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-sm">
          <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
          <Link to="/my-blogs" className="text-gray-300 hover:text-white">My Blogs</Link>
          <Link to="/add-blog" className="text-gray-300 hover:text-white">Add Blog</Link>
          {/* New/Modified link: "About Us" or "Contact" */}
          <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
          {/* We'll create an About Us page later if needed, for now it's just a link */}
        </nav>

        {/* Right Section: Social/Contact Icons */}
        <div className="flex space-x-4">
          {/* Example: Replace with your team's project GitHub or a general contact email */}
          <a href="mailto:contact@quickblog.com" className="text-gray-400 hover:text-white" aria-label="Contact Us">
            <Mail className="w-6 h-6" />
          </a>
          <a href="https://github.com/your-team-repo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="GitHub">
            <Github className="w-6 h-6" />
          </a>
          {/* If you have a team LinkedIn profile or a project specific one */}
          <a href="https://linkedin.com/company/quickblog" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;