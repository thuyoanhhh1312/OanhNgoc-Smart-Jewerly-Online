import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const MainFooter = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 px-6 w-full">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-10 sm:gap-y-0">
        {/* Logo & Copyright */}
        <div className="text-center sm:text-left">
          <p>&copy; {year} Canim. All rights reserved.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center sm:justify-end">
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
          <Link to="/about" className="hover:text-gray-400">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-gray-400">
            Contact
          </Link>
          <Link to="/privacy-policy" className="hover:text-gray-400">
            Privacy Policy
          </Link>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-6 justify-center sm:justify-end">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="text-2xl hover:text-gray-400" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl hover:text-gray-400" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-2xl hover:text-gray-400" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn className="text-2xl hover:text-gray-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
