import React from 'react';
import { Zap, Shield, Eye, Clock, Lock, Globe } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-6 w-6 text-teal-500" />,
    title: "Instant Verification",
    description: "Get fact-checking results in seconds with a simple double-click action."
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-500" />,
    title: "Trust Scores",
    description: "Clear, easy-to-understand trust ratings with source-backed evidence."
  },
  {
    icon: <Eye className="h-6 w-6 text-amber-500" />,
    title: "Bias Detection",
    description: "Identify potential bias, exaggeration, or missing context in online content."
  },
  {
    icon: <Clock className="h-6 w-6 text-green-500" />,
    title: "Time-Saving",
    description: "No more diving into multiple tabs to verify claims and statements."
  },
  {
    icon: <Lock className="h-6 w-6 text-indigo-500" />,
    title: "Privacy-Focused",
    description: "Your data stays private. We don't track browsing or store your searches."
  },
  {
    icon: <Globe className="h-6 w-6 text-purple-500" />,
    title: "Works Everywhere",
    description: "Verify content across news sites, social media, blogs, and more."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TruthMark?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our lightweight Chrome extension brings powerful fact-checking capabilities right to your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Reduce Misinformation, One Click at a Time
              </h3>
              <p className="text-white/90 mb-6">
                Whether you're a journalist, student, professional, or just a curious browser — TruthMark helps you trust what you read, without wasting your time.
              </p>
              <a 
                href="#download" 
                className="bg-white text-teal-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors inline-block self-start"
              >
                Get Started Free
              </a>
            </div>
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-0">
              <img 
                src="https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="TruthMark in action" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;