'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Typewriter } from '@/components/animations/Typewriter';

export interface HeroProps {
  heading?: string;
  subheading?: string;
  animatedWords?: string[];
}

export function Hero({ heading, subheading, animatedWords }: HeroProps) {
  const defaultHeading = "Protecting Lives,";
  const defaultSubheading = "State-of-the-art suppression systems designed for high-risk environments. Ensuring safety with advanced engineering and 24/7 support.";
  
  return (
    <section className="relative pt-32 pb-12 md:pt-36 md:pb-16 overflow-hidden bg-slate-50">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="text-xs font-bold tracking-wider text-red-700 uppercase">The Standard in Fire Safety</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
              {heading || defaultHeading}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                {animatedWords && animatedWords.length > 0 ? (
                   <Typewriter words={animatedWords} />
                ) : (
                   "Stay Safe with NMark."
                )}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-3xl mx-auto font-normal">
              {subheading || defaultSubheading}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-10">
              <Link 
                href="/products"
                className="group relative h-14 px-8 rounded-2xl bg-red-600 text-white font-bold text-lg flex items-center gap-3 hover:bg-red-700 transition-all shadow-xl hover:shadow-red-600/30 hover:-translate-y-0.5"
              >
                Explore Solutions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact"
                className="h-14 px-8 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold text-lg flex items-center hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm hover:shadow-lg"
              >
                Contact Expert
              </Link>
            </div>
          </FadeIn>

          {/* Certification Strip */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 py-8 border-t border-slate-200/60">
                {["ISO 9001:2015 Certified", "NFPA Member Organization", "Bureau of Indian Standards", "National Safety Council"].map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        {cert}
                    </div>
                ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
