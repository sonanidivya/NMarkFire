'use client';

import { FadeIn } from '@/components/animations/FadeIn';

export function ProcessSteps() {
  return (
    <section className="py-16 md:py-32 bg-slate-900 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
              <div className="text-center mb-24">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">How We Ensure Your Safety</h2>
                  <p className="text-xl text-slate-400 max-w-2xl mx-auto">A systematic approach to complete fire protection, from design to compliance.</p>
              </div>
          </FadeIn>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 relative">
               {/* Connecting Line (Desktop) */}
               <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-slate-800 via-red-500/50 to-slate-800"></div>
               
               {/* Connecting Line (Mobile) */}
               <div className="md:hidden absolute top-0 bottom-12 left-10 w-0.5 -ml-px bg-gradient-to-b from-slate-800 via-red-500/50 to-slate-800 z-0"></div>

              {[
                  { step: "01", title: "Consultation", desc: "We analyze your specific safety needs and risks." },
                  { step: "02", title: "Assessment", desc: "Detailed site survey and solution planning." },
                  { step: "03", title: "Implementation", desc: "Professional installation by certified experts." },
                  { step: "04", title: "Maintenance", desc: "Regular checks to ensure 24/7 readiness." },
              ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1} className="h-full">
                      <div className="relative group flex md:block items-start md:items-center text-left md:text-center gap-6 md:gap-0">
                          
                          {/* Number Box */}
                          <div className="shrink-0 w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-xl relative z-10 group-hover:scale-110 group-hover:border-red-500 group-hover:bg-slate-800 transition-all duration-300 md:mx-auto md:mb-8">
                              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 font-mono group-hover:from-red-400 group-hover:to-red-200">{item.step}</span>
                          </div>
                          
                          {/* Text Content */}
                          <div className="pt-2 md:pt-0">
                              <h3 className="text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-red-400 transition-colors">{item.title}</h3>
                              <p className="text-slate-400 leading-relaxed text-sm font-medium">{item.desc}</p>
                          </div>
                      </div>
                  </FadeIn>
              ))}
           </div>
      </div>
    </section>
  );
}
