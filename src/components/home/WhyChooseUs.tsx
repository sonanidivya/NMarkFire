'use client';

import { ShieldCheck, Zap, Award, Settings, Headset as HeadsetIcon } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
           <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Why Industries Choose NMark</h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">Industry leading expertise and commitment to excellence.</p>
           </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: "Certified Safety", 
              desc: "ISI and ISO certified products strictly treated to international safety standards.", 
              icon: ShieldCheck 
            },
            { 
              title: "Rapid Response", 
              desc: "Advanced automatic suppression systems designed to detect and activate instantly.", 
              icon: Zap 
            },
            { 
              title: "Expert Service", 
              desc: "Qualified professionals for comprehensive consultation and installation.", 
              icon: Award 
            },
            { 
              title: "Dedicated Support", 
              desc: "Round-the-clock technical assistance ensuring systems are always ready.", 
              icon: HeadsetIcon 
            },
            { 
              title: "Proven Record", 
              desc: "50+ successful projects and a 100% safety record across diverse industries.", 
              icon: ShieldCheck 
            },
            { 
              title: "Maintenance Free", 
              desc: "Advanced systems designed for durability and minimal maintenance requirements.", 
              icon: Settings 
            }
          ].map((item, i) => (
             <FadeIn key={i} delay={0.1 * (i+1)} className="h-full">
                <div className="p-8 sm:p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-red-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 h-full group flex flex-col">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300">
                      {item.icon === HeadsetIcon ? (
                         <div className="text-slate-900 font-bold group-hover:text-white">24/7</div>
                      ) : (
                         <item.icon className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
                      )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-red-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium group-hover:text-slate-600 transition-colors">{item.desc}</p>
                </div>
             </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
