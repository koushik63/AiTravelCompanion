import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureHighlights } from '../components/landing/FeatureHighlights';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FAQSection } from '../components/landing/FAQSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <FeatureHighlights />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
};
