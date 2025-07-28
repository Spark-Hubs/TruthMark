import React from 'react';
import { ArrowRight, Chrome, Star } from 'lucide-react';

const Download: React.FC = () => {
  return (
    <section id="download" className="py-20 bg-gradient-to-b from-white to-teal-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get TruthMark Today
          </h2>
          <p className="text-gray-600 mb-8 md:text-lg max-w-2xl mx-auto">
            Join thousands of people who use TruthMark daily to verify online information and make informed decisions.
          </p>
          
          <div className="inline-block bg-white rounded-full shadow-md p-1.5 mb-10">
            <div className="bg-teal-500 text-white py-2 px-4 rounded-full flex items-center">
              <Chrome className="h-5 w-5 mr-2" />
              <span>Available for Chrome</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-center mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="h-6 w-6 text-amber-400 fill-amber-400" 
                  />
                ))}
              </div>
              <span className="ml-2 font-semibold">4.9/5 (128 reviews)</span>
            </div>
            
            <a 
              href="#" 
              className="block bg-teal-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-teal-600 transition-colors mb-6 flex items-center justify-center"
            >
              Add to Chrome — Free
              <ArrowRight className="ml-2" size={20} />
            </a>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                <span>Free Forever</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                <span>No Sign-up</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                <span>Lightweight</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                <span>Regular Updates</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                <span>Fast Performance</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                <span>Works Everywhere</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <img 
                src="https://images.pexels.com/photos/3194523/pexels-photo-3194523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="User testimonial" 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="flex mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-4 w-4 text-amber-400 fill-amber-400" 
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "TruthMark has completely changed how I consume news online. I can verify claims instantly without disrupting my reading flow."
            </p>
            <p className="font-medium">Alex T. — Journalist</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <img 
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="User testimonial" 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="flex mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-4 w-4 text-amber-400 fill-amber-400" 
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "As a student, this tool is invaluable for research. I can quickly check facts without going down rabbit holes of verification."
            </p>
            <p className="font-medium">Maya K. — Graduate Student</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <img 
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="User testimonial" 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="flex mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-4 w-4 text-amber-400 fill-amber-400" 
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "I work in communications and need to fact-check constantly. TruthMark makes this process so much faster and more efficient."
            </p>
            <p className="font-medium">James L. — Communications Director</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;