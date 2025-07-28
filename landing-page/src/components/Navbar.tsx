import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-teal-500 mr-2" />
          <span className="text-xl font-bold tracking-tight">
            Truth<span className="text-teal-500">Mark</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <a href="#how-it-works" className="text-gray-700 hover:text-teal-500 transition-colors">
            How It Works
          </a>
          <a href="#features" className="text-gray-700 hover:text-teal-500 transition-colors">
            Features
          </a>
          <a href="#privacy" className="text-gray-700 hover:text-teal-500 transition-colors">
            Privacy
          </a>
          <a 
            href="#download" 
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
          >
            Get Extension
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white p-4 absolute top-full left-0 right-0 shadow-md">
          <div className="flex flex-col space-y-4">
            <a 
              href="#how-it-works" 
              className="text-gray-700 hover:text-teal-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#features" 
              className="text-gray-700 hover:text-teal-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a 
              href="#privacy" 
              className="text-gray-700 hover:text-teal-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Privacy
            </a>
            <a 
              href="#download" 
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              Get Extension
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;