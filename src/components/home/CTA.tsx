'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-16 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] md:rounded-[3rem] bg-slate-900 p-8 sm:p-12 md:p-24 text-center md:text-left relative overflow-hidden shadow-2xl shadow-slate-900/20 group">
                 {/* Background Pattern */}
                 <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
                 <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
                 
                 <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                     <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">Ready to Upgrade Your Safety Standards?</h2>
                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
                           Book a free site audit today. Our engineers will identify risks and propose a compliant, cost-effective solution tailored to your needs.
                        </p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-6 shrink-0">
                         <Link 
                           href="/contact" 
                           className="whitespace-nowrap px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-red-900/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-1"
                         >
                            <ShieldCheck className="w-6 h-6" />
                            Book Free Audit
                         </Link>
                         <Link 
                           href="/products" 
                           className="whitespace-nowrap px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl font-bold text-xl backdrop-blur-sm transition-all flex items-center justify-center gap-3 hover:-translate-y-1"
                         >
                            View Products <ArrowRight className="w-5 h-5" />
                         </Link>
                     </div>
                 </div>
            </div>
        </div>
    </section>
  );
}
