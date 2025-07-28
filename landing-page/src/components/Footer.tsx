import React from 'react';
import { Shield, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-teal-400 mr-2" />
              <span className="text-xl font-bold tracking-tight">
                Truth<span className="text-teal-400">Mark</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              AI-powered trust verification for the web. Instantly fact-check any statement with a simple double-click.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/arzumanabbasov" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://x.com/arzumanai" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto::a.arzuman313@gmail.com" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-teal-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-teal-400 transition-colors">How It Works</a></li>
              <li><a href="#privacy" className="text-gray-400 hover:text-teal-400 transition-colors">Privacy</a></li>
              <li><a href="#download" className="text-gray-400 hover:text-teal-400 transition-colors">Download</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">FAQs</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 TruthMark. All rights reserved. 
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;