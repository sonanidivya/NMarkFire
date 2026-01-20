import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight, Star, Server, ChefHat, Factory, HardHat, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { FadeIn } from '@/components/animations/FadeIn';

import { client } from '@/sanity/lib/client';
import { ALL_CATEGORIES_QUERY, FEATURED_PRODUCTS_QUERY, MAIN_CATEGORIES_NAV_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';

// ... (keep metadata)

export const revalidate = 0; // Force dynamic to reflect Sanity updates immediately

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: Record<string, unknown>; 
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: Record<string, unknown>;
  tag?: string;
  features?: string[];
  category?: {
    slug: string;
  };
}

export default async function ProductsPage() {
  const [categories, featuredProducts, navCategories] = await Promise.all([
    client.fetch<Category[]>(ALL_CATEGORIES_QUERY),
    client.fetch<Product[]>(FEATURED_PRODUCTS_QUERY),
    client.fetch(MAIN_CATEGORIES_NAV_QUERY)
  ]);


  const applications = [
    { name: "Server Rooms", icon: Server, href: "/products/fire-suppression-system/direct-low-pressure-tubing-systems", color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Commercial Kitchens", icon: ChefHat, href: "/products/fire-suppression-system/kitchen-suppression-systems", color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Industrial Plants", icon: Factory, href: "/products/hydrant-and-sprinkler-systems", color: "text-slate-500", bg: "bg-slate-50" },
    { name: "Construction Sites", icon: HardHat, href: "/products/fall-protection-systems", color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar categories={navCategories} />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40 relative overflow-hidden bg-slate-50">
         {/* ... (keep hero content) ... */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <FadeIn>
              {/* ... (keep hero text) ... */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-xs font-bold tracking-wider text-red-700 uppercase">Certified Protection</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 text-slate-900 leading-tight">
                Product Catalog <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">2024 Edition</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                Explore our comprehensive range of certified fire safety solutions, engineered for reliability when it matters most.
              </p>

              {/* Certification Strip */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 px-4">
                  {["ISI Marked Products", "ISO 9001:2015", "CE Certified Valves", "UL Listed Agents"].map((cert, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          {cert}
                      </div>
                  ))}
              </div>
            </FadeIn>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-24">
        
        {/* Featured Solutions - Premium Grid */}
        <section className="mb-32">
           <div className="flex items-center justify-between mb-12 pl-2">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                  <Star className="w-6 h-6 fill-current" />
               </div>
               <div>
                  <h2 className="text-3xl font-bold text-slate-900">Featured Solutions</h2>
                  <p className="text-slate-500 font-medium mt-1">Hand-picked safety systems for critical needs</p>
               </div>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

               {featuredProducts && featuredProducts.length > 0 ? featuredProducts.map((product: any, i: number) => {
                 // Dynamic Link Logic
                 let linkUrl = `/products/${product.category?.slug || 'generic'}/${product.slug}`;
                 if (product._type === 'variant' && product.parent?.slug) {
                    linkUrl = `/products/${product.parent.slug}/${product.slug}`; 
                 } else if (product._type === 'mainCategory') {
                    linkUrl = `/products/${product.slug}`;
                 } else if (!product.category?.slug) {
                    // Fallback for items without category (rare)
                    linkUrl = `/products/${product.slug}`;
                 }

                 // Dynamic Category Label
                 const categoryLabel = product.category?.slug?.replace(/-/g, ' ') || (product._type === 'variant' ? 'System Variant' : 'Featured');

                 return (
                 <FadeIn key={product._id || i} delay={i * 0.1} className="h-full">
                   <Link href={linkUrl} className="group block h-full">
                    <div className="relative h-full bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
                       
                       {/* Floating Tag */}
                       {product.tag && (
                           <div className="absolute top-6 right-6 z-20">
                               <div className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-slate-700">
                                   {product.tag}
                                </div>
                           </div>
                       )}

                       {/* Image Area */}
                       <div className="h-64 relative mb-8 rounded-[2rem] bg-slate-50/80 flex items-center justify-center p-8 group-hover:bg-red-50/30 transition-colors duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                          {product.image && (
                            <NextImage 
                              src={urlFor(product.image).url()} 
                              alt={product.name} 
                              fill 
                              className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 drop-shadow-lg mix-blend-multiply" 
                            />
                          )}
                       </div>
                       
                       {/* Content */}
                       <div className="relative z-10 flex flex-col flex-grow">
                           <div className="mb-4">
                                <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 block">{categoryLabel}</span>
                               <h3 className="text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-tight">{product.name}</h3>
                           </div>
                           
                           <p className="text-slate-500 text-base mb-6 leading-relaxed line-clamp-2">{product.description}</p>
                           
                           {/* Feature Pills */}
                           <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                              {product.features && product.features.slice(0, 2).map((spec: string, k: number) => (
                                 <span key={k} className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600">
                                    {spec}
                                 </span>
                              ))}
                              {product.features && product.features.length > 2 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-400">
                                    +{product.features.length - 2} more
                                </span>
                              )}
                           </div>

                           <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                               <span className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition-colors">View Details</span>
                               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                   <ArrowRight className="w-4 h-4" />
                               </div>
                           </div>
                       </div>
                    </div>
                   </Link>
                 </FadeIn>
               ); }) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <HardHat className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Curating Excellence</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Our editors are selecting the best safety solutions to feature here. Check back soon.</p>
                </div>
              )}
           </div>
        </section>

        {/* Main Categories Directory (The "Big 4") */}
        <div className="mb-32">
             <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-slate-900 pl-2">Browse by Category</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {categories && categories.length > 0 ? categories.map((category: Category) => (
                <Link 
                  key={category._id} 
                  href={`/products/${category.slug}`}
                  className="group block"
                >
                  <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-12 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden">
                    {/* Hover Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-50/50 to-transparent rounded-full blur-3xl -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 w-full flex flex-col items-center h-full">
                        {category.image && (
                          <div className="w-full h-80 relative mb-10">
                            <NextImage 
                              src={urlFor(category.image).url()} 
                              alt={category.name} 
                              fill
                              className="object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-lg" 
                            />
                          </div>
                        )}
                        <h2 className="text-4xl font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-4">
                          {category.name}
                        </h2>
                        <p className="text-slate-500 mb-10 leading-relaxed max-w-xl text-xl">
                          {category.description}
                        </p>
                        <span className="mt-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-50 text-slate-900 font-bold group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                            Browse Collection <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                    </div>
                  </div>
                </Link>
              )) : (
                  <div className="col-span-full py-16 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-400">
                        <Factory className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Categories Coming Soon</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Our team is organizing the catalog. Please verify later.</p>
                  </div>
              )}
            </div>
        </div>

        {/* Browse by Application */}
        <section className="mb-32">
           <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-slate-900 pl-2">Find by Application</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {applications.map((app, i) => (
                 <Link key={i} href={app.href} className="group">
                    <div className="p-4 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 bg-white shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all text-center h-full flex flex-col items-center justify-center gap-3 sm:gap-6 duration-300">
                        <div className={`w-20 h-20 rounded-3xl ${app.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white`}>
                           <app.icon className={`w-10 h-10 ${app.color}`} />
                        </div>
                        <span className="font-bold text-xl text-slate-900 group-hover:text-red-600 transition-colors">{app.name}</span>
                    </div>
                 </Link>
              ))}
           </div>
        </section>



        {/* The NMark Advantage */}
        <section className="mb-32">
           <h2 className="text-3xl font-bold mb-16 text-center text-slate-900">Why Industries Trust NMark</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { title: "ISI & ISO Certified", desc: "100% compliant with Bureau of Indian Standards.", icon: ShieldCheck },
                 { title: "Eco-Friendly Agents", desc: "Zero Ozone Depletion Potential (ODP) solutions.", icon: Factory },
                 { title: "Custom Engineering", desc: "Tailored systems for unique heavy-industry risks.", icon: HardHat },
                 { title: "Rapid Support", desc: "24/7 maintenance and refill network pan-India.", icon: Server },
               ].map((item, i) => (
                  <div key={i} className="text-center p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300 group">
                     <div className="w-20 h-20 mx-auto bg-white rounded-3xl flex items-center justify-center mb-8 text-slate-900 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                        <item.icon className="w-10 h-10" />
                     </div>
                     <h3 className="font-bold text-xl mb-4 text-slate-900">{item.title}</h3>
                     <p className="text-base text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
               ))}
           </div>
        </section>

        {/* Download Center */}
        <FadeIn>
            <section className="mb-32 border-t border-slate-100 pt-24">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden group shadow-2xl shadow-slate-900/10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                    
                    <div className="flex items-center gap-10 relative z-10">
                    <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-white shadow-xl border border-slate-700 group-hover:scale-110 transition-transform duration-500 shrink-0">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-4">Download 2024 Product Brochure</h3>
                        <p className="text-slate-400 max-w-lg text-lg leading-relaxed">Get full access to technical specifications, ISO ratings, and compliance checks for all our fire safety systems.</p>
                    </div>
                    </div>
                    <button className="relative z-10 px-10 py-5 bg-white rounded-2xl font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-4 group/btn shrink-0">
                    <span>Download PDF</span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">4.5 MB</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>
        </FadeIn>



        {/* FAQ Section */}
        <section className="mb-32 max-w-4xl mx-auto">
           <FadeIn>
                <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">Frequently Asked Questions</h2>
           </FadeIn>
           <div className="space-y-6">
              {[
                { q: "Do you provide installation services?", a: "Yes, we have a pan-India network of certified technicians who handle end-to-end installation for all our systems, from simple extinguishers to complex hydrant networks." },
                { q: "Are your products compliant with fire safety norms?", a: "Absolutely. All our products are ISI marked and our suppression systems meet NFPA and ISO standards. We provide full compliance documentation for your safety audits." },
                { q: "How often do fire extinguishers need refilling?", a: "It depends on the type, but generally, visual inspection is required monthly, and a full service/refill is recommended annually or immediately after any use." },
                { q: "Can you help design a fire safety plan for my factory?", a: "Yes! Our 'Book Free Audit' service includes a site visit by an engineer to assess risks and design a custom protection map for your facility." },
              ].map((faq, i) => (
                 <FadeIn key={i} delay={i * 0.1}>
                    <div className="group p-8 rounded-[2rem] border border-slate-200 bg-white hover:border-red-200 hover:shadow-lg transition-all duration-300 cursor-default">
                        <h3 className="font-bold text-xl text-slate-900 mb-4 flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm mt-0.5 group-hover:bg-red-600 group-hover:text-white transition-colors">Q</span> 
                        <span className="mt-0.5">{faq.q}</span>
                        </h3>
                        <div className="pl-12">
                            <p className="text-slate-600 text-lg leading-relaxed">
                            {faq.a}
                            </p>
                        </div>
                    </div>
                 </FadeIn>
              ))}
           </div>
        </section>

        {/* Consultant CTA */}
        <section className="rounded-[2rem] sm:rounded-[3rem] bg-slate-900 p-8 sm:p-12 md:p-24 text-center md:text-left relative overflow-hidden shadow-2xl shadow-slate-900/20">
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Unsure what you need?</h2>
                    <p className="text-slate-400 text-xl leading-relaxed">
                       Our certified engineers can conduct a free safety audit of your premises and recommend the perfect compliance solution.
                    </p>
                 </div>
                 <Link 
                   href="/contact" 
                   className="whitespace-nowrap px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-red-900/30 transition-all flex items-center gap-3 shrink-0 hover:-translate-y-1"
                 >
                    <ShieldCheck className="w-6 h-6" />
                    Book Free Audit
                 </Link>
             </div>
        </section>

      </div>
    </div>
  );
}
