import React from 'react';
import { MousePointer, Search, Shield, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <MousePointer className="h-6 w-6 text-teal-500" />,
    title: "Select Text",
    description: "Highlight any statement or claim you want to verify while browsing online.",
    color: "bg-teal-50",
    borderColor: "border-teal-200"
  },
  {
    icon: <Search className="h-6 w-6 text-blue-500" />,
    title: "Double-Click",
    description: "Use both mouse buttons or right-click menu to instantly analyze the selection.",
    color: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    icon: <Shield className="h-6 w-6 text-amber-500" />,
    title: "AI Analysis",
    description: "TruthMark processes the claim using Perplexity SONAR API for verification.",
    color: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    title: "Get Results",
    description: "View the trust score, sources, and context without leaving your page.",
    color: "bg-green-50",
    borderColor: "border-green-200"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How TruthMark Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Verify any statement online with just a few clicks. TruthMark makes fact-checking 
            seamless and intuitive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl p-6 border ${step.borderColor} ${step.color} transition-all hover:shadow-md group`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm mb-6 group-hover:-translate-y-1 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rotate-45 border-t border-r border-gray-200 bg-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-4xl mx-auto relative">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src="https://images.pexels.com/photos/3082341/pexels-photo-3082341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="TruthMark demonstration" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center p-8">
                <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-teal-100 rounded-full z-0"></div>
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-100 rounded-full z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;