import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Privacy from './components/Privacy';
import Download from './components/Download';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Privacy />
      <Download />
      <Footer />
    </div>
  );
}

export default App;