'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { Wrench, FileSearch, GraduationCap, Truck } from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: "Installation & Commissioning",
    description: "Expert installation of fire suppression systems, extinguishers, and hydrants following international safety codes."
  },
  {
    icon: FileSearch,
    title: "Safety Audits",
    description: "Comprehensive fire safety audits to identify risks and recommend compliance upgrades for your facility."
  },
  {
    icon: Truck,
    title: "Maintenance & Refilling",
    description: "Regular maintenance schedules and certified refilling services for all types of fire extinguishers."
  },
  {
    icon: GraduationCap,
    title: "Training & Consulting",
    description: "Staff training sessions on fire safety protocols and equipment usage to ensure emergency readiness."
  }
];

export function ServicesContent() {
  return (
    <>
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40 relative overflow-hidden bg-slate-50">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-xs font-bold tracking-wider text-red-700 uppercase">End-to-End Solutions</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 text-slate-900 leading-tight">
                Safety Services <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Reimagined</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                Beyond world-class products, we provide a full spectrum of certified services to ensure your critical systems are always mission-ready.
              </p>
              
              {/* Certification Strip */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 px-4">
                  {["ISO 9001:2015 Certified", "NFPA Member Organization", "Bureau of Indian Standards", "National Safety Council"].map((cert, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          {cert}
                      </div>
                  ))}
              </div>
            </FadeIn>
         </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-24">
        {/* Service Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 mb-32">
          {services.map((service, index) => (
            <FadeIn key={index} delay={0.1 * index} className="h-full">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10 xl:p-12 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 group h-full items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>
                
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300 shadow-sm">
                    <service.icon className="h-8 w-8 text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-red-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-lg">
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Process Flow */}
        <div className="mb-32 bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-24 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
          
          <div className="text-center mb-24 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">How We Execute</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our streamlined process ensures your safety systems are installed correctly, compliant from Day 1.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
             {/* Creating the connecting line for Desktop */}
             <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-slate-800 via-red-500/50 to-slate-800"></div>
             
             {[ 
               { step: "01", title: "Consultation", desc: "Detailed risk assessment & site survey." },
               { step: "02", title: "Design", desc: "NFPA compliant engineering drawings." },
               { step: "03", title: "Installation", desc: "Precision setup by certified experts." },
               { step: "04", title: "Support", desc: "24/7 AMC support & annual auditing." }
             ].map((item, i) => (
                <FadeIn key={i} delay={0.2 + (i * 0.1)} className="text-center relative group">
                   {/* Mobile Vertical Connector */}
                   {i !== 3 && <div className="lg:hidden absolute top-20 left-1/2 w-0.5 h-12 bg-slate-800 -ml-px"></div>}
                   
                   <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-8 shadow-xl relative z-10 group-hover:scale-110 group-hover:border-red-500 group-hover:bg-slate-800 transition-all duration-300">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 font-mono group-hover:from-red-400 group-hover:to-red-200">{item.step}</span>
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors">{item.title}</h3>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[150px] mx-auto">{item.desc}</p>
                </FadeIn>
             ))}
          </div>
        </div>

        {/* AMC Packages */}
        <section className="mb-32">
             <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Annual Maintenance Contracts</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-xl">Choose a plan that guarantees your safety compliance year-round.</p>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-2">
                 {/* Standard Plan */}
                 <FadeIn delay={0.1} className="h-full">
                    <div className="h-full p-8 xl:p-10 rounded-[2.5rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 hover:border-slate-300 hover:shadow-xl transition-all relative flex flex-col group">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Standard AMC</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">For small businesses and retail outlets.</p>
                        <div className="text-4xl font-extrabold text-slate-900 mb-1">Essential</div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-8">Packages</div>
                        <ul className="space-y-4 mb-10 flex-1">
                           {[
                             "Quarterly Visual Inspections",
                             "Annual Hydrostore Testing",
                             "Refill Reminders",
                             "Compliance Certification"
                           ].map((feat, i) => (
                              <li key={i} className="flex items-start gap-4 text-slate-600 text-sm font-medium">
                                 <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">✓</div>
                                 {feat}
                              </li>
                           ))}
                        </ul>
                        <button className="w-full py-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300">Request Quote</button>
                    </div>
                 </FadeIn>
                 
                 {/* Premium Plan */}
                 <FadeIn delay={0.2} className="h-full">
                    <div className="h-full p-8 xl:p-10 rounded-[2.5rem] bg-slate-900 text-white relative flex flex-col shadow-2xl shadow-red-900/20 transform lg:-translate-y-6 lg:hover:-translate-y-8 transition-transform duration-300 ring-1 ring-white/10">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        <div className="absolute top-6 right-6">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                            </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2">Comprehensive AMC</h3>
                        <p className="text-slate-400 text-sm mb-8 font-medium">For corporate offices and factories.</p>
                        <div className="text-4xl font-extrabold text-white mb-1">Professional</div>
                        <div className="text-red-500 text-xs font-bold uppercase tracking-wider mb-8">Most Popular</div>
                        
                        <ul className="space-y-4 mb-10 flex-1">
                           {[
                             "Monthly System Checkups",
                             "Unlimited Breakdown Calls",
                             "Free Minor Spares Replacement",
                             "Staff Safety Training Session",
                             "Priority Support (24h SLA)"
                           ].map((feat, i) => (
                              <li key={i} className="flex items-start gap-4 text-slate-300 text-sm font-medium">
                                 <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 shadow-lg shadow-red-600/50">✓</div>
                                 {feat}
                              </li>
                           ))}
                        </ul>
                        <button className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all duration-300">Select Plan</button>
                    </div>
                 </FadeIn>

                 {/* Enterprise Plan */}
                 <FadeIn delay={0.3} className="h-full">
                    <div className="h-full p-8 xl:p-10 rounded-[2.5rem] border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl transition-all relative flex flex-col group">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise Facility</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">For large industrial complexes.</p>
                        <div className="text-4xl font-extrabold text-slate-900 mb-1">Custom</div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-8">Tailored</div>
                        <ul className="space-y-4 mb-10 flex-1">
                           {[
                             "Dedicated On-Site Technician",
                             "Daily System Monitoring",
                             "Spare Part Inventory Management",
                             "Advanced Fire Audits",
                             "Liaison with Fire Department"
                           ].map((feat, i) => (
                              <li key={i} className="flex items-start gap-4 text-slate-600 text-sm font-medium">
                                 <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">✓</div>
                                 {feat}
                              </li>
                           ))}
                        </ul>
                        <button className="w-full py-4 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300">Contact Sales</button>
                    </div>
                 </FadeIn>
             </div>
        </section>

        {/* Value Props Grid */}
        <section className="mb-24 px-4">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                 {[
                   { title: "Genuine Spares", desc: "We use only OEM certified parts.", icon: "🔧" },
                   { title: "24/7 Support", desc: "Emergency response anytime.", icon: "🚑" },
                   { title: "Certified Ops", desc: "ISO 9001:2015 processes.", icon: "📋" },
                   { title: "Pan-India", desc: "Service network across 20+ cities.", icon: "🌏" }
                 ].map((prop, i) => (
                    <FadeIn key={i} delay={0.1 * i}>
                        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="text-4xl mb-4">{prop.icon}</div>
                            <h3 className="font-bold text-slate-900 mb-1">{prop.title}</h3>
                            <p className="text-xs text-slate-500">{prop.desc}</p>
                        </div>
                    </FadeIn>
                 ))}
             </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-slate-900 rounded-3xl p-12 relative overflow-hidden">
             {/* Abstract background detail */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-red-600/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-slate-700/30 blur-3xl"></div>
            
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 text-white">Ready to upgrade your safety?</h2>
                <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg">Get in touch with our expert team for a free site assessment and quote.</p>
                <a href="/contact" className="inline-flex items-center justify-center rounded-lg text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 h-14 px-10 hover:-translate-y-0.5">
                Schedule Assessment
                </a>
            </div>
        </div>
      </div>
    </>
  );
}
