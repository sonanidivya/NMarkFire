import type { Metadata } from 'next';
import Link from 'next/link';
import NextImage from 'next/image';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Globe2, 
  Target, 
  Heart, 
  History, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  HardHat,
  GraduationCap,
  Briefcase,
  Sparkles,
  Quote
} from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { FadeIn } from '@/components/animations/FadeIn';

import { client } from '@/sanity/lib/client';

export const metadata: Metadata = {
  title: 'About NMarkFire | A Legacy of Safety Since 2004',
  description: 'Learn about our mission to protect lives and assets through certified fire safety solutions. 20+ years of engineering excellence and trust.',
  openGraph: {
    title: 'About NMarkFire | A Legacy of Safety Since 2004',
    description: 'Leading manufacturer of ISI/ISO certified fire safety systems.',
  }
};

import { MAIN_CATEGORIES_NAV_QUERY, ABOUT_PAGE_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';

export default async function AboutPage() {
  const [navCategories, aboutData] = await Promise.all([
      client.fetch(MAIN_CATEGORIES_NAV_QUERY),
      client.fetch(ABOUT_PAGE_QUERY)
  ]);

  const stats = [
    { label: "Years Experience", value: "5+", icon: History },
    { label: "Clients Served", value: "50+", icon: Building2 },
    { label: "Client Satisfaction", value: "100%", icon: CheckCircle2 },
    { label: "Certified Products", value: "50+", icon: ShieldCheck },
  ];

  const values = [
    {
      title: "Our Mission",
      icon: Target,
      desc: "To protect lives, assets, and the environment by providing innovative, reliable, and sustainable fire safety solutions through advanced technology, awareness, and prevention.",
      gradient: "bg-blue-50 text-blue-600"
    },
    {
      title: "Our Vision",
      icon: Globe2,
      desc: "To be India's most trusted and innovative fire safety solutions provider, setting new safety standards while delivering exceptional quality and supporting the Make in India initiative.",
      gradient: "bg-purple-50 text-purple-600"
    },
    {
      title: "Core Values",
      icon: Heart,
      desc: "Integrity in engineering, transparency in compliance, and an unwavering commitment to zero-failure standards.",
      gradient: "bg-red-50 text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar categories={navCategories} />

      {/* Hero Section - Matching Home Page Aesthetic */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
           <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-xs font-bold tracking-wider text-red-700 uppercase">Est. 2020</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900">
                Protecting Futures, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Not Just Assets.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-12 font-normal">
                A leading provider of fire and safety solutions, dedicated to ensuring workplace and residential safety with top-tier fire protection services.
              </p>
           </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-900 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">{stat.value}</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
           </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <div className="relative">
                   <div className="absolute -inset-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-[3rem] -z-10 blur-3xl opacity-60"></div>
                   <div className="aspect-[4/3] rounded-[2.5rem] bg-slate-50 overflow-hidden relative border border-slate-100 shadow-2xl shadow-slate-200/20">
                     {/* Placeholder for Story Image */}
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 flex items-center justify-center">
                        <Building2 className="w-40 h-40 text-slate-200" />
                     </div>
                   </div>
                   <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 max-w-sm hidden md:block">
                      <p className="text-slate-600 font-medium italic text-lg leading-relaxed">&quot;Quality is never an accident. It is always the result of intelligent effort.&quot;</p>
                      <div className="mt-4 font-bold text-slate-900">— Founder's Motto</div>
                   </div>
                </div>
              </FadeIn>
              
              <div>
                 <div className="inline-block px-4 py-1.5 bg-red-50 rounded-full text-xs font-bold text-red-600 mb-6 tracking-wider uppercase">Who We Are</div>
                 <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 leading-tight">Company Overview</h2>
                 <div className="prose prose-lg text-slate-500 prose-headings:text-slate-900 mb-10 leading-relaxed">
                    <p className="mb-6 font-medium text-slate-700">
                      Nmark Fire Pvt. Ltd. is a leading provider of fire and safety solutions, dedicated to ensuring workplace and residential safety with top-tier fire protection services.
                    </p>
                    <p className="mb-8">
                       Headquartered in Surat, Gujarat, our company specializes in fire safety equipment supply, installation, maintenance, and compliance solutions, catering to a diverse clientele across industries.
                    </p>
                    
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Our Services</h3>
                        <ul className="space-y-4">
                            {[
                                "Fire Safety Equipment Supply: Extinguishers, alarms, hydrants, sprinklers.",
                                "Installation & Commissioning: End-to-end setup of fire protection systems.",
                                "Annual Maintenance Contracts (AMC): Regular inspection, testing, and servicing.",
                                "Fire Safety Audits & Compliance: Ensuring regulatory adherence and risk assessment.",
                                "Training & Awareness Programs: Fire safety drills and educational programs."
                            ].map((service, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                                    </div>
                                    <span className="text-slate-700 text-base">{service}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/products" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/30">
                       View Our Products <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-all hover:border-slate-300">
                       Partner With Us
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Driven by Purpose</h2>
               <p className="text-xl text-slate-500 leading-relaxed">Every valve we cast, every cylinder we fill, is done with one thought in mind: Safety is non-negotiable.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {values.map((v, i) => (
                  <FadeIn key={i} delay={i * 0.1} className="h-full">
                     <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 h-full hover:-translate-y-2 transition-transform duration-300 group flex flex-col">
                        <div className={`w-16 h-16 rounded-2xl ${v.gradient} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                           <v.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{v.title}</h3>
                        <p className="text-slate-500 leading-relaxed text-lg">{v.desc}</p>
                     </div>
                  </FadeIn>
               ))}
            </div>
         </div>
      </section>

      {/* Certifications - Dark Section for Contrast */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] px-6 py-12 md:p-24 relative overflow-hidden text-center shadow-2xl shadow-slate-900/20">
                 {/* Abstract Grid Pattern */}
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
                 
                 <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-slate-800 rounded-full text-xs font-bold text-slate-300 mb-6 md:mb-8 tracking-wider uppercase border border-slate-700">Compliance & Quality</div>
                    <h2 className="text-2xl md:text-5xl font-bold text-white mb-6 md:mb-8">Certified for Safety</h2>
                    <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
                        We adhere to the strictest international and national safety standards, ensuring every product performs when it counts.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-8 md:gap-20">
                        {/* Metrics Style Certifications */}
                        {[
                            { name: "ISI Marked", code: "IS:15683", desc: "Bureau of Indian Standards" },
                            { name: "ISO 9001", code: "2015", desc: "Quality Management" },
                            { name: "CE Certified", code: "EU", desc: "European Conformity" },
                            { name: "UL Listed", code: "Safety", desc: "Underwriter Laboratories" }
                        ].map((cert, i) => (
                           <div key={i} className="flex flex-col items-center gap-2 group">
                              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.25rem] md:rounded-[1.5rem] bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-white font-bold group-hover:bg-white group-hover:text-slate-900 transition-all duration-300 shadow-lg group-hover:shadow-white/20 group-hover:-translate-y-1">
                                 <span className="text-[10px] md:text-xs opacity-50 uppercase tracking-widest mb-1">{cert.code}</span>
                                 <span className="text-lg md:text-xl">{cert.name.split(' ')[0]}</span>
                              </div>
                              <span className="text-xs md:text-sm font-bold text-slate-400 mt-2">{cert.name}</span>
                           </div>
                        ))}
                    </div>
                 </div>
             </div>
         </div>
      </section>
      
      {/* Leadership Team Placeholder */}
      <section className="py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16">Meet the Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
               {(aboutData?.leaders && aboutData.leaders.length > 0 ? aboutData.leaders : [
                 { 
                    name: "Pareshkumar Khokhar", 
                    role: "Director", 
                    qualification: "BE Electrical Engineer",
                    experience: "5 years in purchasing and service operations.",
                    expertise: "Procurement, supply chain management, and fire safety services.",
                    bio: "Oversees purchasing strategies, service execution, and ensures high-quality standards in fire protection services."
                 },
                 { 
                    name: "Mahendra Ranoliya", 
                    role: "Director",
                    qualification: "B.Com, and CA Inter",
                    experience: "8 years in marketing, finance, and sales.",
                    expertise: "Business development, financial management, and client relations.",
                    bio: "Leads marketing strategies, financial planning, and sales operations to expand market reach and customer engagement."
                 }
               ]).map((member: any, i: number) => (
                   <div key={i} className="group cursor-default bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100 hover:border-red-100/50 flex flex-col md:flex-row gap-8 md:gap-12 items-start hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                     {/* Decorative Background Gradient on Hover */}
                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                     {/* Image Column */}
                     <div className="relative z-10 shrink-0 w-full md:w-auto flex justify-center md:block">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-slate-50 overflow-hidden relative shadow-lg ring-1 ring-slate-100 group-hover:ring-4 group-hover:ring-red-50/50 transition-all duration-500 flex items-center justify-center">
                            {member.image ? (
                               <NextImage 
                                  src={urlFor(member.image).url()} 
                                  alt={member.name}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                               />
                            ) : (
                               <Users className="w-16 h-16 text-slate-300 group-hover:text-slate-400 transition-colors" />
                            )}
                        </div>
                     </div>
                     
                     {/* Content Column */}
                     <div className="flex-1 relative z-10 w-full text-center md:text-left">
                         <div className="mb-6 md:mb-8 border-b border-slate-100 pb-6 md:flex md:justify-between md:items-end">
                            <div>
                                <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-red-700 transition-colors">{member.name}</h3>
                                <div className="inline-flex items-center gap-2 text-red-600 font-bold tracking-widest text-xs uppercase">
                                    <div className="w-6 h-[1px] bg-red-600"></div>
                                    {member.role}
                                </div>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 gap-5 mb-8 text-left">
                            {member.qualification && (
                                <div className="flex items-start gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-red-600 group-hover/item:bg-white group-hover/item:shadow-md transition-all duration-300 shrink-0 mt-0.5">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Qualification</span>
                                        <span className="text-base font-medium text-slate-800 leading-snug">{member.qualification}</span>
                                    </div>
                                </div>
                            )}
                            {member.experience && (
                                <div className="flex items-start gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-blue-600 group-hover/item:bg-white group-hover/item:shadow-md transition-all duration-300 shrink-0 mt-0.5">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Experience</span>
                                        <span className="text-base font-medium text-slate-800 leading-snug">{member.experience}</span>
                                    </div>
                                </div>
                            )}
                            {member.expertise && (
                                <div className="flex items-start gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-amber-600 group-hover/item:bg-white group-hover/item:shadow-md transition-all duration-300 shrink-0 mt-0.5">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Expertise</span>
                                        <span className="text-base font-medium text-slate-800 leading-snug">{member.expertise}</span>
                                    </div>
                                </div>
                            )}
                         </div>
                         
                         {member.bio && (
                            <div className="relative pt-6 md:pl-6 text-left">
                                <Quote className="absolute top-6 left-0 w-6 h-6 text-red-100 hidden md:block" />
                                <p className="text-slate-500 text-lg leading-relaxed italic relative z-10 font-medium">
                                    "{member.bio}"
                                </p>
                            </div>
                         )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
