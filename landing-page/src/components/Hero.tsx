import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-50 to-white"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-[35%] w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              <span className="text-gray-900">Instantly Verify</span>
              <br />
              <span className="text-teal-500">What You Read Online</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              TruthMark uses AI to fact-check any statement with a simple double-click. 
              Get trust scores and evidence in seconds, right in your browser.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#download" 
                className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition-all flex items-center justify-center sm:justify-start group"
              >
                Get TruthMark Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a 
                href="#how-it-works" 
                className="bg-white text-teal-600 border border-teal-200 px-6 py-3 rounded-md hover:bg-teal-50 transition-all flex items-center justify-center sm:justify-start"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="relative z-10 rounded-xl shadow-xl bg-white p-2 max-w-md mx-auto">
              <div className="w-full rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/6956952/pexels-photo-6956952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="TruthMark in action" 
                  className="w-full h-auto"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-[80%]">
                  <div className="flex items-center mb-2">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium text-sm text-gray-900">Truth Score: 92%</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    This claim is verified by 3 reliable sources. Minor details may need context.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-100 rounded-full z-0"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-teal-100 rounded-full z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;