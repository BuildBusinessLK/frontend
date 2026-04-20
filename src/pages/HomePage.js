import React from 'react';
import Hero from '../components/Hero';
import ChatDashboard from '../components/ChatDashboard';
import Features from '../components/Features';
import Industries from '../components/Industries';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ChatDashboard />
      <Features />
      <Industries />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </>
  );
}
