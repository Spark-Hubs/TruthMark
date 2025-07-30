import React from 'react';
import { Lock, Shield, Eye, RefreshCw } from 'lucide-react';

const privacyFeatures = [
  {
    icon: <Lock />,
    title: "No Data Storage",
    description: "We don't store your browsing history or the statements you verify."
  },
  {
    icon: <Shield />,
    title: "Secure Processing",
    description: "All verification is done securely through industry-standard encryption."
  },
  {
    icon: <Eye />,
    title: "Minimal Permissions",
    description: "TruthMark only accesses the content you explicitly select for verification."
  },
  {
    icon: <RefreshCw />,
    title: "Real-time Processing",
    description: "Your selections are processed in real-time and never saved to a database."
  }
];

const Privacy: React.FC = () => {
  return (
    <section id="privacy" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Private. Fast. Accurate.</h2>
            <p className="text-gray-600 mb-8">
              TruthMark respects your privacy and operates with complete transparency. We've designed our extension to provide powerful fact-checking without compromising your data or security.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {privacyFeatures.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="text-teal-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold mb-6">Our Privacy Commitment</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-gray-700">
                    <span className="font-medium">No tracking:</span> We don't track your browsing habits or build profiles based on your activity.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-gray-700">
                    <span className="font-medium">Minimal data:</span> Only the text you select is temporarily processed for verification and immediately discarded.
                  </p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-gray-700">
                    <span className="font-medium">No cookies:</span> TruthMark doesn't use cookies or other tracking mechanisms.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-gray-700">
                    <span className="font-medium">Transparent code:</span> Our extension is open for review, so you can verify our privacy claims.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  We use our own AI-powered verification service that adheres to strict privacy and data protection standards. For more information, view our full privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;