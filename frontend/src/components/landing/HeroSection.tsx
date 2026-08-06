import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative text-center space-y-8 max-w-4xl mx-auto px-4 pt-12 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold shadow-lg shadow-sky-500/10"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        AI-Powered Smart Travel Companion
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent leading-tight"
      >
        Plan, Experience & Relive <br />
        <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
          Your Next Journey in India & Abroad
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
      >
        Gemini AI-generated itineraries, live weather-adapted activity maps, real-time Vande Bharat & IndiGo transport status, and photo memory albums.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 pt-4"
      >
        <Link to="/register" className="glass-button text-base px-8 py-3.5 flex items-center gap-2">
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
        <Link to="/dashboard" className="glass-button-secondary text-base px-8 py-3.5 flex items-center gap-2">
          Go to Dashboard
        </Link>
      </motion.div>
    </section>
  );
};
